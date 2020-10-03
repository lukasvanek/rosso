import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const defaultState = {};
export const ioConfig = {
  i: [],
};
const TextOutput = ({ cid }) => {
  const text = useSelector((state) => {
    const inputKey = state.links[cid];
    return state.values[inputKey];
  });

  return (
    <div style={{ maxWidth: 300 }}>
      <h2>Text Output</h2>
      {JSON.stringify(text)}
    </div>
  );
};

export default TextOutput;
