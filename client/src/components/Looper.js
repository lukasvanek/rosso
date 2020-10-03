import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'rebass';
import * as R from 'ramda';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const defaultState = {
  clip: [
    {
      time: 0,
      tones: ['C2'],
    },
    {
      time: 1000,
      tones: [],
    },
    {
      time: 2000,
      tones: ['D2'],
    },
  ],
};
export const ioConfig = {
  o: [],
  i: [],
};
const Looper = ({ cid, Actions, state: { clip } }) => {
  const length = 5000;

  const inputTones = useSelector((state) => {
    const inputKey = state.links[cid];
    return state.values[inputKey];
  });

  const outputTones = useSelector((state) => state.values[cid]);

  useEffect(() => {
    Actions.setVal([cid, inputTones]); // bypass
  }, [inputTones]);

  const [playing, setPlaying] = useState(false);
  const [loops, setLoops] = useState([]);
  const [touts, setTouts] = useState([]);

  const [recording, setRecording] = useState(false);
  const prevRecording = usePrevious(recording);
  const [recInitTime, setRecInitTime] = useState(null);

  const playClip = () => {
    clip.map((ev) => {
      const tout = setTimeout(() => {
        Actions.setVal([cid, [...inputTones, ...ev.tones]]);
      }, ev.time);
      setTouts([...touts, tout]);
    });
  };

  useEffect(() => {
    if (!playing) {
      Actions.setVal([cid, []]);
      loops.map((l) => clearInterval(l));
      setLoops([]);
      touts.map((t) => clearTimeout(t));
      setTouts([]);
    } else {
      playClip();
      const loop = setInterval(() => {
        playClip();
      }, length);
      setLoops([...loops, loop]);
    }
  }, [playing, clip]);

  useEffect(() => {
    if (recording) {
      let time = 0;

      if (recInitTime) {
        time = new Date().getTime() - recInitTime;
      }

      const newEv = {
        time,
        tones: inputTones,
      };

      Actions.setState([cid, ['clip'], [...clip, newEv]]);
    }
    if (!prevRecording && recording) {
      // started
      setRecInitTime(new Date().getTime());
    }
    if (prevRecording && !recording) {
      // stopped
      setRecInitTime(null);
    }
  }, [recording, inputTones]);

  return (
    <div>
      <h2>Looper</h2>
      <div>Output: {outputTones}</div>
      <Button
        variant={playing ? 'primary' : 'outline'}
        onClick={() => setPlaying(!playing)}
      >
        {playing ? 'Stop' : 'Play'}
      </Button>

      <Button
        variant={recording ? 'secondary' : 'outline'}
        onClick={() => setRecording(!recording)}
      >
        {recording ? 'Stop rec' : 'REC'}
      </Button>

      <Button
        variant="outline"
        onClick={() => Actions.setState([cid, ['clip'], []])}
      >
        Erase
      </Button>

      <PianoRoll clip={clip} playing={playing || recording} length={length} />
    </div>
  );
};

export default Looper;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    let id;
    if (delay !== null) {
      id = setInterval(tick, delay);
      return () => clearInterval(id);
    } else {
      clearInterval(id);
    }
  }, [delay]);
}

const getEndtime = (clip, tone, index) => {
  const ev = clip[index];
  let endTime = ev.time;

  for (let i = index; i < clip.length; i++) {
    const nextEv = clip[i];
    if (nextEv && !nextEv.tones.includes(tone)) {
      endTime = nextEv.time;
      return endTime;
    }
  }
  return endTime;
};

const getTonesOfClip = (clip, length) => {
  const result = [];
  for (const [index, ev] of Object.entries(clip)) {
    ev.tones.map((tone) => {
      const o = {
        tone,
        start: ev.time,
        end: getEndtime(clip, tone, index),
      };
      result.push({
        ...o,
        left: (o.start * 100) / length,
        width: ((o.end - o.start) * 100) / length,
      });
    });
  }
  return result;
};

const PianoRoll = ({ clip, playing, length }) => {
  const prevPlaying = usePrevious(playing);
  const [time, setTime] = useState(0);

  const step = 10;

  useInterval(
    () => {
      setTime(time + step);
    },
    playing ? step : null
  );

  useEffect(() => {
    if (time >= length) {
      setTime(0);
    }
  }, [time]);

  useEffect(() => {
    if (prevPlaying && !playing) {
      setTime(0);
    }
  }, [playing]);

  const tonesOfClip = getTonesOfClip(clip, length);

  const contHeight = tonesOfClip.length * 10 + 10;

  return (
    <div
      style={{
        marginTop: '20px',
        width: '100%',
        height: contHeight,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          zIndex: 200,
          width: 1,
          height: contHeight,
          top: 0,
          left: `${(time / length) * 100}%`,
        }}
      />
      {R.range(0, 5).map((x) => (
        <div
          key={`rollSeparA${x}`}
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(255,255,255,0.1)',
            width: 1,
            height: contHeight,
            top: 0,
            left: `${x * 25}%`,
          }}
        />
      ))}
      {R.range(0, 11).map((x) => (
        <div
          key={`rollSeparB${x}`}
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(255,255,255,0.1)',
            width: 1,
            height: contHeight,
            top: 0,
            left: `${x * 12.5}%`,
          }}
        />
      ))}
      {R.range(0, 16).map((x) => (
        <div
          key={`rollSeparC${x}`}
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(255,255,255,0.1)',
            width: 1,
            height: contHeight,
            top: 0,
            left: `${x * 6.25}%`,
          }}
        />
      ))}
      {tonesOfClip.map((o, i) => (
        <div
          key={'tone09321' + i}
          style={{
            position: 'absolute',
            zIndex: 100,
            backgroundColor: 'white',
            color: 'black',
            top: i * 10,
            left: o.left.toFixed(3) + '%',
            height: 10,
            width: o.width.toFixed(3) + '%',
            fontSize: 7,
          }}
        >
          {o.tone}
        </div>
      ))}
    </div>
  );
};
