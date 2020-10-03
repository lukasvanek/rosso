import React, { useEffect } from 'react';
import { Slider } from '@rebass/forms';
import { useSelector } from 'react-redux';
// import * as Tone from 'tone';

export const defaultState = {
  frequency: 0.5,
};
export const ioConfig = {
  o: [],
  i: [],
};
const Filter = ({ Actions, cid, state: { frequency } }) => {
  const sourcesIds = useSelector((state) => state.links[cid]);

  useEffect(() => {
    if (global.Tone && sourcesIds) {
      global['_ToneModule_' + cid] = new global.Tone.Filter({ frequency });
      setTimeout(() => {
        sourcesIds.forEach((id) => {
          global['_ToneModule_' + id].connect(global['_ToneModule_' + cid]);
        });
      }, 200);
    }
  }, [sourcesIds]);

  useEffect(() => {
    if (global.Tone && sourcesIds) {
      global['_ToneModule_' + cid].set({ frequency });
    }
  }, [frequency]);

  const changeValues = (path, value) => {
    Actions.setState([cid, path, value]);
  };

  return (
    <div>
      <h2>Filter</h2>
      {global.Tone ? (
        <div>
          <Slider
            value={frequency}
            min={20}
            max={20000}
            step={1}
            onChange={(e) => changeValues(['frequency'], e.target.value)}
          />
          Frequency: {frequency}Hz
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Filter;
