import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const defaultState = {
  url: 'https://api.kanye.rest/',
  method: 'GET',
};
export const ioConfig = {
  i: ['', 'url'],
  o: [],
};
const API = ({ Actions, cid, state }) => {
  const { url, method, body } = state;

  const urlValue = useSelector((s) => {
    const inputKey = s.links[`${cid}/url`];
    return s.values[inputKey];
  });

  useEffect(() => {
    if (urlValue && urlValue.includes('http')) {
      Actions.setState([cid, [], { ...state, url: urlValue }]);
    }
  }, [urlValue]);

  const trigger = useSelector((s) => {
    const inputKey = s.links[cid];
    return s.values[inputKey];
  });

  useEffect(() => {
    if (trigger) {
      const callAPI = async () => {
        const rawResponse = await fetch(url, {
          method,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: method !== 'GET' ? JSON.stringify(body) : undefined,
        });
        const content = await rawResponse.json();
        Actions.setVal([cid, content]);
      };
      callAPI();
    }
  }, [trigger]);

  return (
    <div>
      <h2>API</h2>
      {method} {url}
    </div>
  );
};

export default API;
