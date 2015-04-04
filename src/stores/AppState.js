import BaseStore from './BaseStore';
import AppStateConstants from '../constants/AppStateConstants'
let viewModel;
class AppState extends BaseStore {

  constructor(TimeMachine){
    this.TimeMachine = TimeMachine;
    super();
  }

  get current() {
    return this.TimeMachine.current.toJS();
  }

  get viewModel() {
    return viewModel;
  }

  authenticate(){
    this.update({ user: 'yeehaa' })
  }

  browseModel(selection){
    console.log(selection);
    viewModel = selection;
  }

  switchMode(mode){
    this.update({ mode: mode });
  }

  revertHistory(){
    let change = this.TimeMachine.revertHistory();
    return change ? this.emitChange() : null;
  }

  forwardHistory(){
    let change = this.TimeMachine.forwardHistory();
    return change ? this.emitChange() : null;
  }

  update(props){
    let change = this.TimeMachine.update(props);
    return change ? this.emitChange() : null;
  }

  handleAction(action){
    switch(action.actionType) {
      case AppStateConstants.AUTHENTICATE:
        this.authenticate();
        break;
      case AppStateConstants.SWITCH_MODE:
        this.switchMode(action.mode);
        break;
      case AppStateConstants.BROWSE_MODEL:
        this.browseModel(action.selection);
        break;
      case AppStateConstants.REVERT_HISTORY:
        this.revertHistory();
        break;
      case AppStateConstants.FORWARD_HISTORY:
        this.forwardHistory();
        break;
    }
    return true;
  }
}

export default AppState;