import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

const keyCodes = [
  65,
  87,
  83,
  69,
  68,
  70,
  84,
  71,
  89,
  72,
  85,
  74,
  75,
  79,
  76,
  80,
  186,
  222,
  221,
  220,
];

const Tones = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getTone(keyCode, transpose = 0) {
  let toneIndex = keyCodes.indexOf(keyCode);
  if (toneIndex > -1) {
    if (toneIndex > 11) {
      toneIndex -= 12;
      transpose += 1;
    }
    const n = 4 + transpose;
    const tone = Tones[toneIndex];
    return `${tone}${n}`;
  }
  return false;
}

export const defaultState = {
  transpose: -2,
};
export const ioConfig = {
  o: [],
};

const MIDIkeyboard = ({ cid, Actions, state: { transpose } }) => {
  const tones = useSelector((state) => state.values[cid]);

  const pushTone = (tone) => {
    if (tones && tones.includes(tone)) return;
    const presentTones = tones;
    Actions.setVal([cid, [...presentTones, tone]]);
  };

  const shiftTone = (tone) => {
    const newArr = tones.filter((t) => t !== tone);
    Actions.setVal([cid, newArr]);
  };

  const handleKeyDown = useCallback(
    (event) => {
      const code = event.keyCode;
      if (code === 90) {
        // Z
        Actions.setState([cid, ['transpose'], transpose - 1]);
        return;
      }
      if (code === 88) {
        // X
        Actions.setState([cid, ['transpose'], transpose + 1]);
        return;
      }
      const tone = getTone(code, transpose);
      if (tone) pushTone(tone);
    },
    [tones, transpose]
  );

  const handleKeyUp = useCallback(
    (event) => {
      const code = event.keyCode;
      const tone = getTone(code, transpose);
      if (tone) shiftTone(tone);
    },
    [tones, transpose]
  );

  useEffect(() => {
    Actions.setVal([cid, []]);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div>
      <h2>MIDI keyboard input</h2>
      <div>Transpose: {transpose}</div>
      <div>Input: {tones}</div>
    </div>
  );
};

export default MIDIkeyboard;
