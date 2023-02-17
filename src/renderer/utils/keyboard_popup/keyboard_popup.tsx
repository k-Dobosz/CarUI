import { useRef, useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import './keyboard_popup.scss';

interface KeyboardPopupProps {
  placeholder: string;
  visible: boolean;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export default function KeyboardPopup(props: KeyboardPopupProps) {
  const [input, setInput] = useState('');
  const [layout, setLayout] = useState('default');
  const keyboard = useRef();
  const { placeholder, visible, onSubmit, onCancel } = props;

  const onChange = (input) => setInput(input);

  const handleShift = () =>
    setLayout(layout === 'default' ? 'shift' : 'default');

  const onKeyPress = (button) => {
    switch (button) {
      case '{shift}':
        handleShift();
        break;
      case '{lock}':
        handleShift();
        break;
      case '{enter}':
        onSubmit(input);
        break;
      default:
        break;
    }
  };

  const onChangeInput = (event) => {
    const input = event.target.value;
    setInput(input);
    keyboard.current.setInput(input);
  };

  return (
    <div
      className="keyboard_popup"
      style={{ visibility: visible ? 'visible' : 'hidden' }}
    >
      <div className="input_container">
        <input
          value={input}
          placeholder={placeholder}
          onChange={onChangeInput}
          type="password"
        />
        <button onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
      <Keyboard
        keyboardRef={(r) => (keyboard.current = r)}
        theme="hg-theme-default dark-theme"
        layoutName={layout}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
    </div>
  );
}
