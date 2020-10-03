import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'rebass';

const Controls = () => {
  const dispatch = useDispatch();

  const { setEnvVal } = dispatch.env;

  const showBlockBorders = useSelector((state) => state.env.showBlockBorders);
  const showControls = useSelector((state) => state.env.showControls);

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 50, margin: 8 }}>
      <Button
        onClick={() => setEnvVal(['showBlockBorders', !showBlockBorders])}
        variant={showBlockBorders ? 'primary' : 'outline'}
      >
        Edgy
      </Button>
      <Button
        onClick={() => setEnvVal(['showControls', !showControls])}
        variant={showControls ? 'primary' : 'outline'}
      >
        Ctrls
      </Button>
    </div>
  );
};

export default Controls;
