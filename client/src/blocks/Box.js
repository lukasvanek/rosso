import React, { forwardRef } from 'react';
import * as R from 'ramda';
import { Box } from 'rebass';

export const defaultState = {
  sx: {
    border: '1px solid blue'
  }
}

const BoxComponent = (props, ref) => {

  const { bid, state, children } = props;

  const otherProps = R.omit(['bid', 'state', 'children'], props);

  return (
    <Box {...state} {...otherProps} ref={ref}>
      {children}
    </Box>
  )
}

export default forwardRef(BoxComponent);
