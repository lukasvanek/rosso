import * as R from 'ramda';

let endpoint = 'https://api.rosso.solutions';

if (process.env.NODE_ENV === 'development') {
  endpoint = 'http://localhost:5000';
}

const API = async ({ path, method, body = {} }) => {
  const rawResponse = await fetch(`${endpoint}/${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: method !== 'GET' ? JSON.stringify(body) : undefined,
  });
  const content = await rawResponse.json();
  return content;
};

const Get = (path) => API({ method: 'GET', path });

const Post = (path, body) => API({ method: 'POST', path, body });

const _env = {
  devMode: 'flow', // 'flow' || 'layout'
  appId: null,
  zoom: 1,
  wantsInput: null,
  wantsOutput: null,
  boxEditing: null,
  showBlockBorders: true,
  showControls: true,
  selectedBlocks: [],
  multipleSelect: false,
};
const env = {
  state: _env,
  reducers: {
    setEnvVal(state, payload) {
      const [key, val] = payload;
      return {
        ...state,
        [key]: val,
      };
    },
    resetWants(state) {
      return {
        ...state,
        wantsInput: null,
        wantsOutput: null,
      };
    },
    selectBlock(state, bid) {
      if (state.multipleSelect) {
        return R.assoc('selectedBlocks', [...state.selectedBlocks, bid])(state);
      }
      return R.assoc('selectedBlocks', [bid])(state);
    },
  },
  effects: (dispatch) => ({
    async saveApp(payload, rootState) {
      const newApp = await Post('app', {
        _id: rootState.env.appId,
        components: rootState.components,
        links: rootState.links,
      });
      dispatch.env.setEnvVal(['appId', newApp._id]);
      window.location.replace(`/${newApp._id}`);
    },

    async fetchApp(payload, rootState) {
      const app = await Get(`app/${rootState.env.appId}`);
      if (app) {
        dispatch.components.load(app.components);
        dispatch.links.load(app.links);
      }
    },
  }),
};

export default env;
