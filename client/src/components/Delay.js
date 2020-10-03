import React, { useEffect } from 'react';
import { Slider } from '@rebass/forms';
import { useSelector } from 'react-redux';

export const defaultState = {
  delayTime: 0.5,
  feedback: 0.5,
};
export const ioConfig = {
  o: [],
  i: [],
};
const Filter = ({ Actions, cid, state: { delayTime, feedback } }) => {
  const sourcesIds = useSelector((state) => state.links[cid]);

  useEffect(() => {
    if (global.Tone && sourcesIds) {
      global['_ToneModule_' + cid] = new global.Tone.PingPongDelay(
        delayTime,
        feedback
      );
      setTimeout(() => {
        sourcesIds.forEach((id) => {
          global['_ToneModule_' + id].connect(global['_ToneModule_' + cid]);
        });
      }, 200);
    }
  }, [sourcesIds]);

  useEffect(() => {
    if (global['_ToneModule_' + cid]) {
      global['_ToneModule_' + cid].set({ delayTime, feedback });
    }
  }, [delayTime, feedback]);

  const changeValues = (path, value) => {
    Actions.setState([cid, path, value]);
  };

  return (
    <div>
      <h2>Delay</h2>
      {global.Tone ? (
        <div>
          <Slider
            value={delayTime}
            min={0}
            max={5}
            step={0.01}
            onChange={(e) => changeValues(['delayTime'], e.target.value)}
          />
          Time: {delayTime}s
          <Slider
            value={feedback}
            min={0}
            max={1}
            step={0.01}
            onChange={(e) => changeValues(['feedback'], e.target.value)}
          />
          Feedback: {feedback}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Filter;
