import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const ioConfig = {
  i: [],
};

const Master = ({ cid }) => {
  const sourcesIds = useSelector((state) => state.links[cid]);

  useEffect(() => {
    if (global.Tone && sourcesIds) {
      setTimeout(() => {
        sourcesIds.forEach((id) => {
          if (!global['_ToneModule_' + id]) return;
          global['_ToneModule_' + id].toDestination();
          console.log('master linked');
        });
      }, 200);
    }
  }, [sourcesIds]);

  return (
    <div>
      <h2>Master sound output</h2>
    </div>
  );
};

export default Master;
