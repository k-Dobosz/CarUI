
import {
  HTMLInputTypeAttribute,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './keyboard_popup.scss';

interface KeyboardPopupProps {
  placeholder: string;
  visible: boolean;
  inputType: HTMLInputTypeAttribute;
  initialValue?: string | number;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export default function KeyboardPopup({
  placeholder,
  visible,
  inputType,
  initialValue = '',
  onSubmit,
  onCancel,
}: KeyboardPopupProps) {
  const [input, setInput] = useState('');
  const [layout, setLayout] = useState<'default' | 'shift'>('default');
  const [focusIndex, setFocusIndex] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  const getButtons = useCallback(() => {
    if (!popupRef.current) return [];

    return Array.from(
      popupRef.current.querySelectorAll<HTMLButtonElement>('.hg-button'),
    );
  }, []);

  useEffect(() => {
    if (!visible) return;

    setInput(String(initialValue ?? ''));
    setLayout('default');
    setFocusIndex(0);
  }, [visible, initialValue]);

  const pressKey = useCallback(
    (key: string) => {
      switch (key) {
        case '{bksp}':
          setInput((value) => value.slice(0, -1));
          break;

        case '{space}':
          setInput((value) => `${value} `);
          break;

        case '{shift}':
        case '{lock}':
          setLayout((value) => (value === 'default' ? 'shift' : 'default'));
          break;

        case '{enter}':
          onSubmit(input);
          break;

        default:
          // Ignore other special-key tokens.
          if (key.startsWith('{') && key.endsWith('}')) return;
          setInput((value) => value + key);
          break;
      }
    },
    [input, onSubmit],
  );

  useEffect(() => {
    if (!visible) return;

    const buttons = getButtons();

    buttons.forEach((button, index) => {
      button.classList.toggle('keyboard-focused', index === focusIndex);
      button.tabIndex = index === focusIndex ? 0 : -1;
    });

    buttons[focusIndex]?.focus({ preventScroll: true });
  }, [focusIndex, layout, visible, getButtons]);

  useEffect(() => {
    if (!visible) return;

    const handler = (event: KeyboardEvent) => {
      const handledKeys = [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Enter',
        'Escape',
      ];

      if (!handledKeys.includes(event.key)) return;

      event.preventDefault();
      event.stopPropagation();

      if (event.key === 'Escape') {
        onCancel();
        return;
      }

      const buttons = getButtons();
      if (!buttons.length) return;

      const currentIndex = Math.min(focusIndex, buttons.length - 1);

      if (event.key === 'Enter') {
        const key = buttons[currentIndex]?.dataset.skbtn;
        if (key) pressKey(key);
        return;
      }

      if (event.key === 'ArrowLeft') {
        setFocusIndex(Math.max(0, currentIndex - 1));
        return;
      }

      if (event.key === 'ArrowRight') {
        setFocusIndex(Math.min(buttons.length - 1, currentIndex + 1));
        return;
      }

      // Group buttons into their actual visual rows.
      const rows: HTMLButtonElement[][] = [];

      buttons.forEach((button) => {
        const top = button.offsetTop;
        let row = rows.find((items) => items[0]?.offsetTop === top);

        if (!row) {
          row = [];
          rows.push(row);
        }

        row.push(button);
      });

      const rowIndex = rows.findIndex((row) => row.includes(buttons[currentIndex]));
      const currentButton = buttons[currentIndex];
      const currentCenter =
        currentButton.offsetLeft + currentButton.offsetWidth / 2;

      const targetRowIndex =
        event.key === 'ArrowDown' ? rowIndex + 1 : rowIndex - 1;
      const targetRow = rows[targetRowIndex];

      if (!targetRow?.length) return;

      let nearestIndex = currentIndex;
      let nearestDistance = Number.POSITIVE_INFINITY;

      targetRow.forEach((button) => {
        const center = button.offsetLeft + button.offsetWidth / 2;
        const distance = Math.abs(center - currentCenter);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = buttons.indexOf(button);
        }
      });

      setFocusIndex(nearestIndex);
    };

    window.addEventListener('keydown', handler, true);

    return () => {
      window.removeEventListener('keydown', handler, true);
    };
  }, [visible, focusIndex, getButtons, onCancel, pressKey]);

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={popupRef}
      className="keyboard_popup visible"
      role="dialog"
      aria-modal="true"
      aria-label="On-screen keyboard"
    >
      <div className="input_container">
        <input
          value={input}
          placeholder={placeholder}
          type={inputType}
          readOnly
          aria-label="Current setting value"
        />

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>

      <Keyboard
        theme="hg-theme-default dark-theme"
        layoutName={layout}
        onKeyPress={pressKey}
      />
    </div>
  );
}