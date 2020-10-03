import React from 'react';
import { useDispatch } from 'react-redux';

const components = [
  'MIDIkeyboard',
  'ExternalMIDI',
  'Looper',
  'Oscillator',
  'MembraneSynth',
  'Reverb',
  'Filter',
  'Delay',
  'Master',
  'TextInput',
  'TextOutput',
  'API',
  'Button',
];
// input text

const styles = {
  nav: {
    position: 'fixed',
    top: 140,
    left: 0,
    margin: 0,
    width: 50,
    zIndex: 500000,
  },
  navButton: {
    background: 'transparent',
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'rgba(255,255,255,0.65)',
    border: 'none',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    width: '100%',
    padding: '10px 0',
    cursor: 'pointer',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
};

const Nav = () => {
  const dispatch = useDispatch();

  const handleCreate = (name) => () => {
    dispatch.components.addComponent({
      name,
    });
  };

  return (
    <div style={styles.nav}>
      {components.map((c, i) => (
        <button
          key={'navButton' + i}
          style={{
            ...styles.navButton,
          }}
          onClick={handleCreate(c)}
          variant="outline"
        >
          {c.slice(0, 4)}
        </button>
      ))}
    </div>
  );
};

export default Nav;
