import {
  HTMLInputTypeAttribute,
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
  const [layout, setLayout] = useState('default');
  const [focusIndex, setFocusIndex] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  const getButtons = () => {
    if (!popupRef.current) {
      return [];
    }

    return Array.from(
      popupRef.current.querySelectorAll<HTMLButtonElement>(
        '.hg-button'
      )
    );
  };

  useEffect(() => {
    if (visible) {
      setInput(String(initialValue ?? ''));
      setFocusIndex(0);
    }
  }, [visible, initialValue]);



  const pressKey = (key: string) => {
    switch (key) {
      case '{bksp}':
        setInput((value) => String(value).slice(0, -1));
        break;


      case '{space}':
        setInput((value) => String(value) + ' ');
        break;


      case '{shift}':
      case '{lock}':
        setLayout((value) =>
          value === 'default'
            ? 'shift'
            : 'default'
        );
        break;


      case '{enter}':
        onSubmit(input);
        setInput('');
        break;
        
      default: 
        setInput((value) =>
          String(value) + key
        );
        break;
    }
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    const buttons = getButtons();

    buttons.forEach((button) => {
      button.classList.remove(
        'keyboard-focused'
      );
    });

    buttons[focusIndex]?.classList.add(
      'keyboard-focused'
    );

  }, [focusIndex, visible, layout]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const handler = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const buttons = getButtons();

      if (!buttons.length) {
        return;
      }

      switch (event.key) {
        case 'ArrowRight': 
          setFocusIndex((index) =>
            Math.min(
              index + 1,
              buttons.length - 1
            )
          );
          break;

        case 'ArrowLeft': 
          setFocusIndex((index) =>
            Math.max(
              index - 1,
              0
            )
          );
          break;

        case 'ArrowDown': 
          setFocusIndex((index) =>
            Math.min(
              index + 10,
              buttons.length - 1
            )
          );
          break;

        case 'ArrowUp': 
          setFocusIndex((index) =>
            Math.max(
              index - 10,
              0
            )
          );
          break;

        case 'Enter': 
          const key = buttons[focusIndex]?.dataset.skbtn;

          if (key) {
            pressKey(key);
          }
          break;

        case 'Escape': 
          onCancel();
          break;
      }
    };

    window.addEventListener(
      'keydown',
      handler,
      true
    );

    return () => {
      window.removeEventListener('keydown', handler, true);
    };

  }, [visible,focusIndex,input]);

  return (
    <div ref={popupRef} className={`keyboard_popup ${visible ? 'visible' : ''}`}>
      <div className="input_container">
        <input value={input} placeholder={placeholder} type={inputType} readOnly />
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>

      <Keyboard
        theme="hg-theme-default dark-theme"
        layoutName={layout}
        onChange={(value) => {
          setInput(String(value));
        }}
        onKeyPress={pressKey}
      />

    </div>
  );
}