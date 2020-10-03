import React, { useState } from 'react';
import * as R from 'ramda';
import { useSelector, useDispatch } from 'react-redux';
import JSON5 from 'json5';
import { Flex, Button, Text } from 'rebass';
import Nav from './Nav';
import Controls from './Controls';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import mergeRefs from 'react-merge-refs';
import { HotKeys } from 'react-hotkeys';
import CodeEditor from './CodeEditor';
import VisualEditor from './VisualEditor';

const BlockControls = ({ b }) => {
  const boxEditing = useSelector((state) => state.env.boxEditing);
  const dispatch = useDispatch();

  const handleEdit = () => {
    if (boxEditing === b.bid) {
      return dispatch.env.setEnvVal(['boxEditing', null]);
    }
    dispatch.env.setEnvVal(['boxEditing', b.bid]);
  };

  return (
    <Flex style={{ position: 'absolute', top: 0, left: 0 }} alignItems="center">
      <div
        style={{
          display: 'inline-block',
          background: 'black',
          width: 20,
          height: 20,
          padding: 0,
        }}
      />
      <Text fontFamily="monospace" fontSize={11} px={2}>
        {b.bid.slice(0, -38)}
      </Text>
      <Button
        sx={{ size: 20, padding: 0, letterSpacing: 0 }}
        onClick={handleEdit}
        variant={boxEditing === b.bid ? 'primary' : 'outline'}
      >
        e
      </Button>
      <Button
        sx={{ size: 20, padding: 0, letterSpacing: 0 }}
        onClick={() => dispatch.layout.removeBlock(b.bid)}
        variant={'outline'}
      >
        x
      </Button>
    </Flex>
  );
};

const DraggableComponent = ({ b }) => {
  const [{ isDragging }, dragRef] = useDrag({
    item: { id: b.bid, type: 'block' },
    collect: (mon) => ({
      isDragging: !!mon.isDragging(),
    }),
  });
  return <BlockWrapper b={b} dragRef={dragRef} isDragging={isDragging} />;
};

const ComponentWrapper = ({ cid }) => {
  const dispatch = useDispatch();

  const c = useSelector((state) => state.components[cid]);

  const [{ isDragging }, dragRef] = useDrag({
    item: { id: cid, type: 'block' },
    collect: (mon) => ({
      isDragging: !!mon.isDragging(),
    }),
  });

  if (!c || !c.name) return <></>;

  const Component = require(`../../components/${c.name}`);
  // const { ioConfig } = Component;
  const TheComponent = Component.default;

  const Actions = {
    setVal: dispatch.values.setVal,
    setLink: dispatch.links.setLink,
    setState: dispatch.components.setState,
  };

  return (
    <div ref={dragRef}>
      <TheComponent
        // object from store.components to props
        {...c} // { name, c.cid, ... }
        Actions={Actions}
      />
    </div>
  );
};

const BlockWrapper = ({ b, dragRef = null, isDragging = false }) => {
  const showBlockBorders = useSelector((state) => state.env.showBlockBorders);
  const showControls = useSelector((state) => state.env.showControls);
  const selectedBlocks = useSelector((state) => state.env.selectedBlocks);
  const blocks = useSelector((state) => state.layout);
  const dispatch = useDispatch();

  const boxProps = R.omit('children', b);

  const [{ isOver }, dropRef] = useDrop({
    accept: 'block',
    drop: (item, mon) => {
      if (mon.isOver({ shallow: true }) && item.id !== b.bid) {
        dispatch.layout.move({ itemId: item.id, destinationId: b.bid });
      }
    },
    collect: (mon) => ({
      isOver: !!mon.isOver({ shallow: true }),
      canDrop: !!mon.canDrop(),
    }),
  });

  let blockState = {
    ...boxProps.state,
    sx: {
      ...boxProps.state.sx,
      position: 'relative',
      transition: 'all 150ms ease-in-out',
    },
  };

  if (showBlockBorders) {
    blockState.sx.borderStyle = 'solid';
    blockState.sx.borderWidth = '1px';
    blockState.sx.borderColor = blockState.sx.borderColor || 'black';
  }

  if (selectedBlocks.includes(b.bid)) {
    blockState.sx.borderColor = 'cyan';
  }

  if (isOver) {
    blockState.bg = 'rgba(255,100,100,0.2)';
  }

  if (isDragging) {
    blockState.sx.opacity = 0;
  }

  const Block = require(`../../blocks/${b.name}`).default;

  return (
    <Block
      {...boxProps}
      state={blockState}
      id={`tc-block-${b.bid}`}
      ref={mergeRefs([dragRef, dropRef])}
      onMouseDown={(e) => {
        e.stopPropagation();
        dispatch.env.selectBlock(b.bid);
      }}
    >
      {b.bid !== 'adam' && !!showControls && <BlockControls b={b} />}

      {b.children.length < 1 && <div style={{ padding: 20 }}>Empty</div>}

      {b.children.map((childId) => {
        if (R.endsWith('_block', childId)) {
          return (
            <DraggableComponent
              key={`block-${childId}`}
              b={{ bid: childId, ...blocks[childId] }}
            />
          );
        }
        if (R.endsWith('_component', childId)) {
          return (
            <ComponentWrapper key={`blockcomp-${childId}`} cid={childId} />
          );
        }
      })}
    </Block>
  );
};

const Blocks = () => {
  const b = useSelector((state) => state.layout['adam']);

  return <BlockWrapper b={{ bid: 'adam', ...b }} />;
};

const Layout = () => {
  const showControls = useSelector((state) => state.env.showControls);

  const dispatch = useDispatch();

  const keyMap = {
    MULTIPLE_SELECT_ON: { sequence: 'command', action: 'keydown' },
    MULTIPLE_SELECT_OFF: { sequence: 'command', action: 'keyup' },
    DUPLICATE: 'command+d',
  };

  const handlers = {
    MULTIPLE_SELECT_ON: (e) => dispatch.env.setEnvVal(['multipleSelect', true]),
    MULTIPLE_SELECT_OFF: (e) =>
      dispatch.env.setEnvVal(['multipleSelect', false]),
    DUPLICATE: (e) => {
      e.preventDefault();
      dispatch.env.setEnvVal(['multipleSelect', false]);
      dispatch.layout.duplicateSelection();
    },
  };

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <DndProvider backend={HTML5Backend}>
        <Blocks />
      </DndProvider>

      <Nav />
      <Controls />
      {showControls && (
        <>
          <CodeEditor />
          <VisualEditor />
        </>
      )}
    </HotKeys>
  );
};

export default Layout;
