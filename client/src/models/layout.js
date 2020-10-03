import * as R from 'ramda';
import { v4 as uuidv4 } from 'uuid';

const _layout = {
  adam: {
    name: 'Box',
    state: {
      sx: {
        width: '100%',
        height: '100%',
      },
    },
    parent: null,
    children: [],
  },
  //   'box-1': {
  //     name: 'Box',
  //     state: { p: 20, sx: { borderColor: 'red'} },
  //     parent: 'adam',
  //     children: ['box-2']
  //   },
  //   'box-2': {
  //     name: 'Box',
  //     state: { p: 10, sx: { borderColor: 'blue'} },
  //     parent: 'box-1',
  //     children: []
  //   }
  //   'box-3': {
  //     name: 'Flex',
  //     state: { p: 10, sx: { borderColor: 'green'} },
  //     parent: 'box-1',
  //     children: ['box-4', 'box-5', 'box-6']
  //   },
  //   'box-4': {
  //     name: 'Box',
  //     state: { p: 5, sx: { borderColor: 'yellow'} },
  //     parent: 'box-3',
  //     children: []
  //   },
  //   'box-5': {
  //     name: 'Box',
  //     state: { p: 5, sx: { borderColor: 'cyan'} },
  //     parent: 'box-3',
  //     children: []
  //   },
  //   'box-6': {
  //     name: 'Box',
  //     state: { p: 5, sx: { borderColor: 'magenta'} },
  //     parent: 'box-3',
  //     children: []
  //   },
};

const generateBID = (name) => {
  return name.slice(0, 4) + '_' + uuidv4() + '_block';
};

const prepareBlock = (
  layoutMap,
  { bid, name, state, parent = 'adam', children = [] }
) => {
  // const defaultState = require(`../blocks/${c.name}`).defaultState;

  return {
    bid: bid || generateBID(name),
    name,
    state: state || {
      p: 20,
    },
    parent,
    children,
  };
};

const moveInArr = (arr, from, to) => {
  arr.splice(to, 0, arr.splice(from, 1)[0]);
  return arr;
};

const bidFromDnDid = (dndid) => dndid.slice(0, -5);

const layout = {
  state: _layout,
  reducers: {
    setState(state, payload) {
      const [bid, path, value] = payload;
      return R.assocPath([bid, 'state', ...path], value)(state);
    },

    addBlock(state, payload) {
      const { name } = payload;
      let { parent } = payload;
      if (!state[parent]) {
        parent = 'adam';
      }
      const newB = prepareBlock(state, { name, parent });
      const parentCh = state[newB.parent].children;
      return R.pipe(
        R.assoc(newB.bid, newB),
        R.assocPath([newB.parent, 'children'], [...parentCh, newB.bid])
      )(state);
    },

    insertComponent(state, c) {
      const parentCh = state[c.parent].children;
      return R.assocPath([c.parent, 'children'], [...parentCh, c.cid])(state);
    },

    ejectComponent(state, c) {
      const parentCh = state[c.parent].children;
      return R.assocPath(
        [c.parent, 'children'],
        parentCh.filter((ch) => ch !== c.cid)
      )(state);
    },

    duplicateBlock(state, bid) {
      const blockProps = R.omit(['bid', 'children'], state[bid]);
      const newB = prepareBlock(state, blockProps);
      const parentCh = state[newB.parent].children;
      return R.pipe(
        R.assoc(newB.bid, newB),
        R.assocPath([newB.parent, 'children'], [...parentCh, newB.bid])
      )(state);
    },

    changeParent(state, { bid, parent }) {
      return R.assocPath([bid, 'parent'], parent)(state);
    },

    addChildren(state, { childId, parent }) {
      const parentCh = state[parent].children;
      return R.assocPath([parent, 'children'], [...parentCh, childId])(state);
    },

    dissocBlock(state, bid) {
      return R.dissoc(bid)(state);
    },

    disinheritBlock(state, { parent, bid }) {
      const parentCh = state[parent].children;
      return R.assocPath(
        [parent, 'children'],
        parentCh.filter((ch) => ch !== bid)
      )(state);
    },

    moveBlockOrComponent(state, payload) {
      const { itemId, item, destinationId } = payload;
      // moving across droppables
      const parentCh = state[item.parent].children;
      const destinCh = state[destinationId].children;
      return R.pipe(
        R.assocPath(
          [item.parent, 'children'],
          parentCh.filter((x) => x !== itemId)
        ),
        R.assocPath([destinationId, 'children'], [...destinCh, itemId])
      )(state);
    },
  },
  effects: (dispatch) => ({
    duplicateSelection(payload, rootState) {
      const { selectedBlocks } = rootState.env;
      selectedBlocks.forEach((bid) => {
        dispatch.layout.duplicateBlock(bid);
      });
    },

    removeBlock(_bid, rootState) {
      const oldBlock = rootState.layout[_bid];
      const grandpa = oldBlock.parent;
      const { blocks = [], components = [] } = R.groupBy((ch) =>
        R.endsWith('_block', ch) ? 'blocks' : 'components'
      )(oldBlock.children);
      console.log(blocks);
      console.log(components);
      // 1. adoption of oldBlock's chlidren (blocks)
      blocks.forEach((bid) => {
        dispatch.layout.changeParent({
          bid,
          parent: grandpa,
        });
        dispatch.layout.addChildren({ childId: bid, parent: grandpa });
      });
      // 2. adoption of oldBlock's children (components)
      components.forEach((cid) => {
        dispatch.components.changeParent({
          cid,
          parent: grandpa,
        });
        dispatch.layout.addChildren({ childId: cid, parent: grandpa });
      });
      // 3. disinherit oldOblock
      dispatch.layout.disinheritBlock({ parent: grandpa, bid: _bid });
      // 4. funeral of oldBlock
      dispatch.layout.dissocBlock(_bid);
    },

    move(payload, rootState) {
      const { itemId, destinationId } = payload;
      let item;
      if (R.endsWith('_block', itemId)) {
        item = rootState.layout[itemId];
        if (item.parent === destinationId) return;
        dispatch.layout.changeParent({ bid: itemId, parent: destinationId });
      }
      if (R.endsWith('_component', itemId)) {
        item = rootState.components[itemId];
        if (item.parent === destinationId) return;
        dispatch.components.changeParent({
          cid: itemId,
          parent: destinationId,
        });
      }
      dispatch.layout.moveBlockOrComponent({ itemId, item, destinationId });
    },
  }),
};

export default layout;
