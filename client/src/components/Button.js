import React from 'react';
import { Button } from 'rebass';

export const defaultState = {
  title: 'SUBMIT',
};
export const ioConfig = {
  o: [],
};
const ButtonComponent = ({ Actions, cid, state: { title } }) => {
  return (
    <div>
      <Button
        onMouseDown={() => Actions.setVal([cid, 'TRIGGERED'])}
        onClick={() => Actions.setVal([cid, null])}
      >
        {title}
      </Button>
    </div>
  );
};

export default ButtonComponent;
