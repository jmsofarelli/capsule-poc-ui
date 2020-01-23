import React from 'react';
import { HashRouter, Route, Switch } from "react-router-dom";
import Header from '../header/Header';
import HomePage from '../home-page/HomePage';
import LaunchCapsule from '../launch-capsule/LaunchCapule';
import RenderCapsule from '../render-capsule/RenderCapsule';

class App extends React.Component {

  render() {
    return (
      <div>
        <HashRouter>
          <div>
            <Header />
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route path="/launch" component={LaunchCapsule} />
              <Route path="/render/:ipfsAddr" component={RenderCapsule} />
            </Switch>
          </div>
        </HashRouter>
      </div>
    );
  }
}

export default App;
