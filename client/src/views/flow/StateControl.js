import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { Button } from 'rebass';

const StateControl = () => {

  const dispatch = useDispatch();

  const { saveApp } = dispatch.env;

  // const { query } = useRouter();
  const { id } = { id: '' };
  useEffect(() => {
    dispatch.env.setEnvVal(['appId', id ]);
    if (id) {
      dispatch.env.fetchApp();
    }
  }, [id]);


  return (
    <div style={{ position: 'fixed', top: 0, right: 0, margin: 8 }}>
      <Button onClick={() => saveApp()} variant="outline">Save</Button>
    </div>
  )
}

export default StateControl;
