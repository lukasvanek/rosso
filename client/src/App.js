import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Flow from './views/flow';
import Layout from './views/layout';
import { useSelector } from 'react-redux';
import Nav from './views/Nav';

function App() {
  const devMode = useSelector((state) => state.env.devMode);

  return (
    <Router>
      <Nav />
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          top: 0,
          width: 'calc(100% - 70px)',
          minHeight: '100%',
        }}
      >
        <Switch>
          <Route path="/flow">
            <Flow />
          </Route>
          <Route path="/layout" style={{ display: 'contents' }}>
            <Layout />
          </Route>
          <Route path="/">
            <Redirect to={`/${devMode}`} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
