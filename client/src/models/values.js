import * as R from 'ramda';

const _values = {}

const values = {
  state: _values,
  reducers: {
    setVal(state, payload) {
      const [key, val] = payload;
      return {
        ...state,
        [key]: val
      };
    },
    'components/delete': (state, tcId) => {
      return R.dissoc(tcId)(state);
    }
  }
}

export default values;
