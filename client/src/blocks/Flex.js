import React, { forwardRef } from 'react';
import * as R from 'ramda';
import { Flex } from 'rebass';

export const defaultState = {
  sx: {
    border: '1px solid blue'
  }
}

const FlexComponent = (props, ref) => {

  const { bid, state, children } = props;

  const otherProps = R.omit(['bid', 'state', 'children'], props);

  return (
    <Flex {...state} {...otherProps} ref={ref}>
      {children}
    </Flex>
  )
}

export default forwardRef(FlexComponent);
