import * as R from 'ramda';

const _links = {
  //loop1: ['midi'],
  //ms1: ['loop1'],
  //d1: ['m'],
  //rvrb1: ['d1'],
  //fltr1: ['rvrb1'],
  //master: ['ms1']
}

const links = {
  state: _links,
  reducers: {

    addLink(state, payload) {
      const [to, from] = payload;
      if (from === to) return state;
      const actualFroms = state[to] || [];
      return R.assoc(to, [...actualFroms, from])(state);
    },

    deleteLink(state, payload) {
      const [to, from] = payload;
      if (from === to) return state;
      if (state[to]) {
        const froms = state[to].filter(x => x !== from);
        if (froms.length < 1) {
          return R.dissoc(to)(state);
        }
        return R.assoc(to, froms)(state);
      }
      return state;
    },

    load(state, newState) {
      return newState;
    },

    'components/delete': (state, tcId) => {
      const withoutKey = R.dissoc(tcId, state);
      const updatedEntries = Object.entries(withoutKey)
        .map((([to, from]) => {
          if (!Array.isArray(from)) return [to, from];
          return [to, from.filter((x) => x !== tcId)];
        }))
        .filter((([from, to]) => to.length > 0));
      return Object.fromEntries(updatedEntries);
    }

  },
  effects: dispatch => ({

		tryConnect(payload, rootState) {
      const { wantsInput, wantsOutput } = rootState.env;
			if (wantsInput && wantsOutput) {
        dispatch.links.addLink([wantsInput, wantsOutput])
        dispatch.env.resetWants()
      }
    },
    
	}),
}


export default links;

