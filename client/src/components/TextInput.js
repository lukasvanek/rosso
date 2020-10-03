import React from 'react';
import { Label, Input } from '@rebass/forms';
import { useSelector } from 'react-redux';

export const defaultState = {
  label: 'Label',
};
export const ioConfig = {
  o: [],
};

const TextInput = ({ Actions, cid, state: { label } }) => {
  const value = useSelector((state) => state.values[cid]);

  const onChange = (e) => {
    Actions.setVal([cid, e.target.value]);
  };

  return (
    <>
      <Label htmlFor="name">{label}</Label>
      <Input id="name" name="name" value={value} onChange={onChange} />
    </>
  );
};

export default TextInput;
