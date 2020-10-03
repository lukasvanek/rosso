import React, { useEffect } from 'react';
import { Slider } from '@rebass/forms';
import { useSelector } from 'react-redux';

export const defaultState = {
  decay: 0.5,
};
export const ioConfig = {
  o: [],
  i: [],
};
const Reverb = ({ Actions, cid, state: { decay } }) => {
  const sourcesIds = useSelector((state) => state.links[cid]);

  useEffect(() => {
    if (global.Tone && sourcesIds) {
      global['_ToneModule_' + cid] = new global.Tone.Reverb({ decay });
      setTimeout(() => {
        sourcesIds.forEach((id) => {
          global['_ToneModule_' + id].connect(global['_ToneModule_' + cid]);
        });
      }, 200);
    }
  }, [sourcesIds]);

  useEffect(() => {
    if (global.Tone && sourcesIds) {
      global['_ToneModule_' + cid].set({ decay });
    }
  }, [decay]);

  const changeValues = (path, value) => {
    Actions.setState([cid, path, value]);
  };

  return (
    <div>
      <h2>Reverb</h2>
      {global.Tone ? (
        <div>
          <Slider
            value={decay}
            min={0.001}
            max={5}
            step={0.01}
            onChange={(e) => changeValues(['decay'], e.target.value)}
          />
          Decay: {decay}s
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Reverb;
