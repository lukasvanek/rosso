import * as R from 'ramda';
import { v4 as uuidv4 } from 'uuid';

const componentSchema = {
  cid: (v) => !!v && typeof v === 'string',
  name: (v) => !!v && typeof v === 'string',
  dev: (v) => !!v && !!v.position,
  state: (v) => !!v && typeof v === 'object',
};

const testComponent = (c) => {
  const errors = Object.keys(componentSchema)
    .filter((key) => !componentSchema[key](c[key]))
    .map((key) => `invalid-${key}`);
  return {
    valid: errors.length === 0,
    errors,
  };
};

const generateCID = (name) => {
  return name.slice(0, 4) + '_' + uuidv4() + '_component';
};

const prepareComponent = (compMap, cid, c) => {
  const keys = Object.keys(compMap);

  let order = keys.indexOf(cid);

  if (order === -1) order = keys.length + 1;

  const defaultState = require(`../components/${c.name}`).defaultState;

  return {
    cid: cid || generateCID(c.name),
    name: c.name,
    state: defaultState || {},
    parent: c.parent || 'adam',
    dev: {
      position: { x: order * 25, y: order * 25 },
    },
  };
};

const _components = {
  //  "midi": {
  //    name: "MIDIkeyboard",
  //  },
  //  "loop1": {
  //    name: "Looper",
  //  },
  //  "ms1": {
  //    name: "MembraneSynth",
  //  },
  //  "master": {
  //    name: "Master",
  //  }
};

const prepareComponents = (obj) => {
  let newObj = obj;
  Object.keys(obj).forEach((key) => {
    newObj[key] = prepareComponent(obj, key, newObj[key]);
  });
  return newObj;
};

const components = {
  state: prepareComponents(_components),
  reducers: {
    setState(state, payload) {
      const [cid, path, value] = payload;
      return R.assocPath([cid, 'state', ...path], value)(state);
    },
    setDev(state, payload) {
      const [cid, path, value] = payload;
      return R.assocPath([cid, 'dev', ...path], value)(state);
    },
    changeParent(state, { cid, parent }) {
      return R.assocPath([cid, 'parent'], parent)(state);
    },
    assocComponent(state, newC) {
      return R.assoc(newC.cid, newC)(state);
    },
    dissocComponent(state, cid) {
      return R.dissoc(cid)(state);
    },
    load(state, newState) {
      return newState;
    },
  },
  effects: (dispatch) => ({
    addComponent(payload, rootState) {
      const newC = prepareComponent(rootState.components, undefined, payload);
      dispatch.components.assocComponent(newC);
      dispatch.layout.insertComponent(newC);
    },

    removeComponent(cid, rootState) {
      const oldC = rootState.components[cid];
      dispatch.components.dissocComponent(cid);
      dispatch.layout.ejectComponent(oldC);
    },
  }),
};

export default components;
