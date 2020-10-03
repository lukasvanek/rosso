import React from 'react';
import * as R from 'ramda';
import { useSelector, useDispatch } from 'react-redux'
import { Box, Text, Button } from 'rebass';

const makeLabelValuePair = (val) => {
  if (val.includes('/')) {
    const [l, r] = val.split('/');
    return {
      value: Number(l) / Number(r),
      label: val
    }
  }
  return {
    value: Number(val),
    label: val
  }
}

const attrs = [
  {
    key: 'p',
    values: [0,1,2,3,4,5]
  },
  {
    key: 'm',
    values: [0,1,2,3,4,5]
  },
  {
    key: 'bg',
    values: ['black', 'white', 'red', 'green', 'blue', 'pink']
  },
  {
    key: 'color',
    values: ['black', 'white']
  },
  {
    key: 'flexWrap',
    values: ['nowrap', 'wrap', 'wrap-reverse']
  },
  {
    key: 'flexDirection',
    values: ['row', 'row-reverse', 'column', 'column-reverse']
  },

  {
    key: 'alignItems',
    values: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline', 'auto']
  },
  {
    key: 'alignContent',
    values: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch']
  },

  {
    key: 'justifyItems',
    values: ['start', 'center', 'end', 'stretch']
  },
  {
    key: 'justifyContent',
    values: ['flex-start', 'flex-end', 'center','space-between', 'space-around', 'space-evenly']
  },

  {
    key: 'flexGrow',
    values: [0, 1]
  },
  {
    key: 'flexShrink',
    values: [1, 0]
  },
  {
    key: 'flexBasis',
    values: ['30%', '50%', 'content', 'auto']
  },
  {
    key: 'justifySelf',
    values: ['start', 'center', 'end']
  },
  {
    key: 'alignSelf',
    values: ['auto', 'stretch', 'flex-start', 'flex-end', 'center', 'baseline']
  },

  {
    key: 'width',
    values: ['1/8', '1/7', '1/6', '1/5', '1/4', '1/3', '1/2', '1'].map(makeLabelValuePair)
  }
]

const ValueComponent = ({ keyInState, val, currentVal, handleClick }) => {

  let label, value;

  if (typeof val === 'object') {
    label = val.label;
    value = val.value;
  }

  if (typeof val === 'string') {
    label = val;
    value = val;
  }

  if (typeof val === 'number') {
    label = val;
    value = val;
  }

  let buttonStyle = {
    padding: '5px',
    fontSize: '10px',
    marginBottom: '5px',
    letterSpacing: 0
  }

  if (keyInState === 'bg' && val !== 'white') {
    buttonStyle.color = val
  }

  return (
    <Button
      sx={buttonStyle}
      onClick={() => handleClick(keyInState, value)}
      variant={!!currentVal && currentVal === value ? 'primary' : 'outline'}
    >{label}</Button>
  )
}

const VisualEditor = () => {

  const bid = useSelector(state => state.env.boxEditing);
  const block = useSelector((state) => bid ? state.layout[bid] : {});

  const dispatch = useDispatch();

  if (!bid || !block) return (<></>);

  const { state } = block;

  const handleClick = (key, val) => {

    let value = val;

    if (state[key] === val) value = undefined;

    dispatch.layout.setState([bid, [key], value]);

  }

  return (
    <Box
      bg="white"
      pb={20}
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        opacity: 1,
        width: 400,
        height: 200,
        overflow: 'auto'
      }}
    >
      {attrs.map((attr, i) =>
        <Box key={`${attr.key}-${i}`}>
          <Text>{attr.key}</Text>
          <Box
            sx={{
              borderBottom: '1px solid black',
              marginBottom: '5px',
              paddingBottom: '5px'
            }}
          >
            {attr.values.map((val, j) =>
              <ValueComponent
                keyInState={attr.key}
                val={val}
                currentVal={state[attr.key]}
                handleClick={handleClick}
                key={`${attr.key}-${i}-${j}`}
              />
            )}
          </Box>
        </Box>        
      )}
    </Box>
  )
}

export default VisualEditor;
