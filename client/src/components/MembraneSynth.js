import React, { useEffect } from 'react';
import * as R from 'ramda';
import { Slider } from '@rebass/forms';
import { useSelector } from 'react-redux';

const getOptions = (envelope) => ({
  pitchDecay: 0.05,
  octaves: 10,
  oscillator: {
    type: 'sine',
  },
  envelope: {
    ...envelope,
    attackCurve: 'exponential',
  },
});

export const defaultState = {
  volume: -6,
  envelope: {
    attack: 0.001,
    decay: 0.4,
    sustain: 0.01,
    release: 0.4,
  },
};
export const ioConfig = {
  o: [],
  i: [],
};
const MembraneSynth = ({ Actions, cid, state: { volume, envelope } }) => {
  const tones = useSelector((state) => {
    const inputKey = state.links[cid];
    return state.values[inputKey];
  });

  useEffect(() => {
    if (global.Tone) {
      global['_ToneModule_' + cid] = new global.Tone.MembraneSynth(
        getOptions(envelope)
      );
      global['_ToneModule_' + cid].volume.value = volume || 0;
    }
  }, []);

  useEffect(() => {
    Actions.setVal([cid, tones]); // bypass
    global['_ToneModule_' + cid].set({ envelope });
    global['_ToneModule_' + cid].volume.value = volume || 0;
    if (!tones || tones.length < 1) return;
    global['_ToneModule_' + cid].triggerAttackRelease(R.last(tones), '8n');
  }, [tones]);

  const changeValues = (path, value) => {
    Actions.setState([cid, path, value]);
  };

  return (
    <div>
      <h2>MembraneSynth</h2>
      {global.Tone ? (
        <div>
          <Slider
            value={volume}
            min={-50}
            max={0}
            step={1}
            onChange={(e) => changeValues(['volume'], e.target.value)}
          />
          Volume: {volume || 0} dB
          <Slider
            value={envelope.attack}
            min={0}
            step={0.01}
            max={1}
            onChange={(e) =>
              changeValues(['envelope', 'attack'], e.target.value)
            }
          />
          Attack: {envelope.attack}
          <Slider
            value={envelope.decay}
            step={0.01}
            min={0}
            max={1}
            onChange={(e) =>
              changeValues(['envelope', 'decay'], e.target.value)
            }
          />
          Decay: {envelope.decay}
          <Slider
            value={envelope.sustain}
            min={0}
            step={0.01}
            max={1}
            onChange={(e) =>
              changeValues(['envelope', 'sustain'], e.target.value)
            }
          />
          Sustain: {envelope.sustain}
          <Slider
            value={envelope.release}
            onChange={(e) =>
              changeValues(['envelope', 'release'], e.target.value)
            }
            step={0.01}
            min={0}
            max={1}
          />
          Release: {envelope.release}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default MembraneSynth;
