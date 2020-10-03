import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Nav from './Nav';
import ComponentWrapper from './ComponentWrapper';
import Patches from './Patches';
import ZoomControl from './ZoomControl';
import StateControl from './StateControl';

const Components = () => {
  const components = useSelector((state) => state.components);
  return (
    <>
      {Object.entries(components).map(([cid, c]) => (
        <ComponentWrapper key={`tc-component-${cid}`} c={c} />
      ))}
    </>
  );
};

const Flow = () => {
  const boardContainer = useRef(null);
  const [boardPosition, setBoardPosition] = useState({ top: 0, left: 0 });
  const zoom = useSelector((state) => state.env.zoom);

  return (
    <>
      <div
        ref={boardContainer}
        id="tc-board-container"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          ...boardPosition,
          transform: `scale(${zoom})`,
          transition: 'transform 140ms ease-in-out',
        }}
      >
        <Patches />
        <Components />
      </div>
      <Nav />
      <StateControl />
      <ZoomControl />
    </>
  );
};

export default Flow;
