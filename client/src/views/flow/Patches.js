import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as R from 'ramda';
import { RiScissorsLine } from 'react-icons/ri';

export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
}

const getPoints = ({ from, to }) => {
  const fromEl = document.getElementById(`tc-component-${from}`);
  const toEl = document.getElementById(`tc-component-${to}`);
  if (!fromEl || !toEl) {
    return false;
  }
  const fromB = fromEl.getBoundingClientRect();
  const toB = toEl.getBoundingClientRect();

  const offsetX = -70;

  const x1 = fromB.left + fromB.width / 2 + offsetX;
  const y1 = fromB.top + fromB.height;
  const x2 = toB.left + toB.width / 2 + offsetX;
  const y2 = toB.top;

  const mx = (x2 + x1) * 0.5;
  const my = (y2 + y1) * 0.5;

  return { x1, y1, x2, y2, mx, my };
};

const Patch = ({ from, to }) => {
  const fromComp = useSelector((state) => state.components[from].dev.position);
  const toComp = useSelector((state) => state.components[to].dev.position);
  const signal = useSelector((state) => state.values[from]);
  const zoom = useSelector((state) => state.env.zoom);

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    R.range(1, 15).map((t) => setTimeout(forceUpdate, t * 10));
  }, [zoom]);

  useEffect(() => {
    window.addEventListener('resize', forceUpdate, true);
    return () => {
      // cleanup
      window.removeEventListener('resize', forceUpdate, true);
    };
  }, []);

  const points = getPoints({ from, to });

  if (!points) {
    return <></>;
  }

  const { x1, y1, x2, y2, mx, my } = points;

  const theta = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2;
  let offset = 20;
  if (x1 < x2) offset = -20;
  if (Math.abs(x1 - x2) < 20) offset = x1 - x2;

  const cx = mx + offset * Math.cos(theta);
  const cy = my + offset * Math.sin(theta);

  const d = 'M' + x1 + ' ' + y1 + ' Q ' + cx + ' ' + cy + ' ' + x2 + ' ' + y2;

  let color = 'rgb(0,255,255)';
  if (!signal || signal.length < 1) {
    color = 'rgb(0,100,255)';
  }

  return (
    <path
      //x1={x1} y1={y1}
      //x2={x2} y2={y2}
      style={{
        transition: 'stroke .15s ease',
      }}
      d={d}
      stroke={color}
      strokeWidth={3}
      fill="transparent"
    />
  );
};

const PatchControls = ({ from, to }) => {
  const fromComp = useSelector((state) => state.components[from].dev.position);
  const toComp = useSelector((state) => state.components[to].dev.position);
  const zoom = useSelector((state) => state.env.zoom);
  const dispatch = useDispatch();

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    R.range(1, 15).map((t) => setTimeout(forceUpdate, t * 10));
  }, [zoom]);

  useEffect(() => {
    window.addEventListener('resize', forceUpdate, true);
    return () => {
      // cleanup
      window.removeEventListener('resize', forceUpdate, true);
    };
  }, []);

  const points = getPoints({ from, to });

  if (!points) {
    return <></>;
  }

  const { mx, my } = points;

  return (
    <button
      onClick={() => dispatch.links.deleteLink([to, from])}
      style={{
        position: 'absolute',
        zIndex: 100000,
        border: 'none',
        borderRadius: 100,
        height: 30,
        width: 30,
        background: 'rgba(0,0,0,0)',
        color: 'rgba(0,0,0,0.3)',
        cursor: 'pointer',
        top: my - 15,
        left: mx - 15,
      }}
    >
      <RiScissorsLine />
    </button>
  );
};

const transformTo = (str) => str.split('/')[0];

const Patches = () => {
  const L = useSelector((state) => state.links);
  const zoom = useSelector((state) => state.env.zoom);
  return (
    <>
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          minHeight: '100%',
          pointerEvents: 'none',
          strokeLinecap: 'round',
          transform: `scale(${1 / zoom})`,
          transition: 'transform 140ms ease-in-out',
          zIndex: 100,
        }}
      >
        {Object.entries(L).map(([to, froms]) =>
          Array.isArray(froms) ? (
            froms.map((from) => (
              <Patch
                key={`patch-${to}-${from}`}
                to={transformTo(to)}
                from={from}
              />
            ))
          ) : (
            <Patch
              key={`patch-${to}-${froms}`}
              to={transformTo(to)}
              from={froms}
            />
          )
        )}
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          minHeight: '100%',
          transform: `scale(${1 / zoom})`,
          transition: 'transform 140ms ease-in-out',
        }}
      >
        {Object.entries(L).map(([to, froms]) =>
          Array.isArray(froms) ? (
            froms.map((from) => (
              <PatchControls
                key={`patchctrl-${to}-${from}`}
                to={transformTo(to)}
                from={from}
              />
            ))
          ) : (
            <PatchControls
              key={`patchctrl-${to}-${froms}`}
              to={transformTo(to)}
              from={froms}
            />
          )
        )}
      </div>
    </>
  );
};

export default Patches;
