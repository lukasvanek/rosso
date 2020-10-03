import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'rebass';

const ZoomControl = () => {

  const dispatch = useDispatch();

  const { setEnvVal } = dispatch.env;

  const zoom = useSelector(state => state.env.zoom);
  
  const setZoom = (zoom) => setEnvVal(['zoom', zoom]);

  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, margin: 8 }}>
      <Button onClick={() => setZoom(zoom - 0.1)} variant="outline">-</Button>
      <Button onClick={() => setZoom(zoom + 0.1)} variant="outline">+</Button>
      {(zoom * 100).toFixed(0)}%
    </div>
  )
}

export default ZoomControl;
