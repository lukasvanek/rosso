import React, { useEffect } from 'react';
import { Slider } from '@rebass/forms';
import { useSelector } from 'react-redux';

export const defaultState = {
  osc: {
    volume: -6,
    type: 'square',
    detune: 0,
    phase: 0,
    transpose: 0,
  },
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
const Oscillator = ({ Actions, cid, state: { osc, envelope } }) => {
  const tones = useSelector((state) => {
    const inputKey = state.links[cid];
    return state.values[inputKey];
  });

  useEffect(() => {
    if (global.Tone) {
      const options = {
        oscillator: osc,
        envelope,
      };
      global['_ToneModule_' + cid] = new global.Tone.PolySynth(
        global.Tone.Synth,
        options
      );
      global['_ToneModule_' + cid].volume.value = osc.volume;
    }
  }, []);

  useEffect(() => {
    Actions.setVal([cid, tones]); // bypass
    if (!tones) return;
    const transposedTones = tones.map((t) =>
      global.Tone.Frequency(t).transpose(osc.transpose)
    );
    global['_ToneModule_' + cid].releaseAll();
    global['_ToneModule_' + cid].set({ envelope });
    global['_ToneModule_' + cid].volume.value = osc.volume;
    global['_ToneModule_' + cid].triggerAttack(transposedTones);
  }, [tones]);

  const changeValues = (path, value) => {
    Actions.setState([cid, path, value]);
  };

  return (
    <div>
      <h2>Oscillator</h2>

      {global.Tone && (
        <div>
          Type: {osc.type}
          <br />
          <Slider
            value={osc.volume}
            min={-50}
            max={0}
            step={1}
            onChange={(e) => changeValues(['osc', 'volume'], e.target.value)}
          />
          Volume: {osc.volume} dB
          <Slider
            value={osc.transpose}
            min={-24}
            max={24}
            step={1}
            onChange={(e) => changeValues(['osc', 'transpose'], e.target.value)}
          />
          Transpose: {osc.transpose}
          <Slider
            value={envelope.attack}
            min={0.01}
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
      )}
    </div>
  );
};

export default Oscillator;
