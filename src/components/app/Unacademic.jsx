import css from './app.css';

import React from 'react';
import Sidebar from '../sidebar/Sidebar.jsx';
import Main from '../main/Main.jsx';

class Unacademic extends React.Component{

  render() {
    let { model, appState } = this.props;
    let { collection } = model;
    return (
      <section className="app">
        <Sidebar appState={ appState }/>
        <Main collection={ collection }/>
      </section>
    )
  }
};

Unacademic.propTypes = {
  model: React.PropTypes.object.isRequired,
  appState: React.PropTypes.object.isRequired
}

export default Unacademic;