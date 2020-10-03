import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Draggable from 'react-draggable';
import { Flex, Box } from 'rebass';

const styles = {
  handle: {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    cursor: 'move',
  },
  deleteButton: {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    cursor: 'pointer',
    border: 'none',
    color: 'white',
    fontSize: 10,
    color: 'rgba(255,255,255,1)',
    fontWeight: 300,
    textTransform: 'uppercase',
    verticalAlign: 'top',
  },
  ioButton: {
    width: '100%',
    padding: '4px 0',
    height: 20,
    display: 'inline-block',
    cursor: 'pointer',
    border: 'none',
    color: 'white',
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 300,
    textTransform: 'uppercase',
    letterSpacing: '0.4em',
    verticalAlign: 'top',
  },
};

const InputButton = ({ c, inputName }) => {
  const dispatch = useDispatch();
  const { setEnvVal } = dispatch.env;
  const { tryConnect } = dispatch.links;
  const wantsInput = useSelector((state) => state.env.wantsInput);

  let inputId = c.cid;
  let text = 'Input';
  if (inputName) {
    inputId = `${inputId}/${inputName}`;
    text = inputName;
  }

  return (
    <button
      onClick={() => {
        setEnvVal(['wantsInput', wantsInput === inputId ? null : inputId]);
        tryConnect(inputId);
      }}
      style={{
        ...styles.ioButton,
        backgroundColor: wantsInput === inputId ? 'black' : 'transparent',
        color: wantsInput === inputId ? 'white' : 'rgba(0,0,0,0.5)',
      }}
    >
      {text}
    </button>
  );
};

const OutputButton = ({ c }) => {
  const dispatch = useDispatch();
  const { setEnvVal } = dispatch.env;
  const { tryConnect } = dispatch.links;
  const wantsOutput = useSelector((state) => state.env.wantsOutput);

  let text = 'Output';

  return (
    <button
      onClick={() => {
        setEnvVal(['wantsOutput', wantsOutput === c.cid ? null : c.cid]);
        tryConnect(c.cid);
      }}
      style={{
        ...styles.ioButton,
        backgroundColor: wantsOutput === c.cid ? 'black' : 'rgba(0,0,0,0.05)',
        color: wantsOutput === c.cid ? 'white' : 'rgba(0,0,0,0.5)',
      }}
    >
      {text}
    </button>
  );
};

const ComponentWrapper = ({ c }) => {
  const dispatch = useDispatch();

  const { setDev } = dispatch.components;

  const boardContainer = useRef(null);
  const zoom = useSelector((state) => state.env.zoom);

  if (!c || !c.name) return;

  const Component = require(`../../components/${c.name}`);
  const { ioConfig } = Component;
  const TheComponent = Component.default;

  const Actions = {
    setVal: dispatch.values.setVal,
    setLink: dispatch.links.setLink,
    setState: dispatch.components.setState,
  };

  return (
    <Draggable
      handle={`#tc-component-${c.cid}-handle`}
      position={c.dev.position}
      scale={2 + (zoom - 1) * 2}
      offsetParent={boardContainer.current}
      onDrag={(e, ui) => {
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
        setDev([
          c.cid,
          ['position'],
          {
            y: ui.lastY,
            x: ui.lastX,
          },
        ]);
      }}
    >
      <Box
        m={10}
        bg="rgb(240,240,240)"
        style={{
          color: 'black',
          position: 'absolute',
          top: c.dev.position.y,
          left: c.dev.position.x,
          overflow: 'hidden',
        }}
        id={`tc-component-${c.cid}`}
      >
        <Flex id={`tc-component-${c.cid}-handle`} bg="rgb(0,0,0,0.05)">
          <Box sx={styles.handle} />

          {ioConfig.i && ioConfig.i.length === 0 && (
            <Box flex="1 1 auto">
              <InputButton c={c} />
            </Box>
          )}

          {ioConfig.i &&
            ioConfig.i.length > 0 &&
            ioConfig.i.map((inputName, n) => (
              <Box key={`tc-component-${c.cid}-input-${n}`} flex="1 1 auto">
                <InputButton c={c} inputName={inputName} />
              </Box>
            ))}

          {!ioConfig.i && <Box flex="1 1 auto" />}

          <Box>
            <button
              style={styles.deleteButton}
              onClick={() => dispatch.components.removeComponent(c.cid)}
            >
              x
            </button>
          </Box>
        </Flex>

        <Box p={20}>
          <TheComponent
            // object from store.components to props
            {...c} // { name, c.cid, ... }
            Actions={Actions}
          />
        </Box>

        {ioConfig.o && <OutputButton c={c} />}
      </Box>
    </Draggable>
  );
};

export default ComponentWrapper;
