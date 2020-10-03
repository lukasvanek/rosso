import { createLogger } from 'redux-logger'
import { init } from '@rematch/core'
import createRematchPersist from '@rematch/persist'
import models from './models'

const middlewares = [];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(createLogger({ diff: true, collapsed: true }));
}

const persistPlugin = createRematchPersist({
  whitelist: ['components', 'env', 'links', 'layout'],
  throttle: 1000,
  version: 1
})

export const store = init({
  redux: {
    middlewares,
  },
  models,
  plugins: [persistPlugin],
});

