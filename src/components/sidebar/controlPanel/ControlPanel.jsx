import React from 'react';
import AuthenticationPanel from './authenticationPanel/AuthenticationPanel.jsx';
import HistoryPanel from './historyPanel/HistoryPanel.jsx';
import ModePanel from './modePanel/ModePanel.jsx';
import LevelPanel from './levelPanel/LevelPanel.jsx';

class ControlPanel extends React.Component {

  render() {
    let appState = this.props.appState;
    let { user, modes, history, viewModel } = appState;
    return (
      <section className="panel panel-bottom panel-control">
        <AuthenticationPanel user={ user }/>
        <HistoryPanel isEarliest={ history.isEarliest } isLatest={ history.isLatest }/>
        <div className="panel panel-horizontal">
          <LevelPanel viewModel={ viewModel }/>
          <ModePanel modes={ modes }/>
        </div>
      </section>
    )
  }
};

ControlPanel.propTypes = {
  appState: React.PropTypes.object.isRequired,
}

export default ControlPanel;
