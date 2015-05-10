import AppStoreStore from '../../src/stores/AppState.js';
import AppStoreConstants from '../../src/constants/AppStateConstants.js';
import { React, TestUtils, fixtures, testdom } from '../react-helpers';
import { Map, Stack }  from 'immutable';

describe("AppStore Store", () => {
  let AppStore;
  let TimeMachine;
  let state;
  let ViewModel;
  let selection;

  beforeEach(() => {
    state = {
      user: 'yeehaa',
      modes: {
        learn: 'disabled',
        curate: 'active'
      },
      levels: {
        waypoints: 'all',
        waypoint: 1,
        checkpoint: false
      }
    };
    TimeMachine = {};
    ViewModel = {};

    ViewModel.get = sinon.spy();
    TimeMachine.get = sinon.stub().returns({ toJS(){ return state } });

    AppStore = new AppStoreStore(TimeMachine, ViewModel);

    AppStore.emitChange = sinon.spy();
    AppStore.ViewModel.set = sinon.stub().returns(selection);
    AppStore.TimeMachine.update = sinon.stub().returns(true);
  });

  describe("get current state", () => {
    let appState;

    beforeEach((done) => {
      AppStore.get().then((data) => {
        appState = data.appState;
        done();
      });
    });

    it("gets the current state from the time machine", () => {
      expect(TimeMachine.get).to.be.called;
    })

    it("gets the corresponding view model", () => {
      expect(ViewModel.get).to.be.calledWith(state);
    })

    it("adds a handy current mode shortcut", () => {
      let { current } = appState.modes;
      expect(current).to.equal('curate');
    })

    it("adds a handy current mode shortcut", () => {
      let { current } = appState.levels;
      expect(current).to.equal('waypoint');
    })
  })

  describe("actions", () => {
    let action;

    describe("authentication", () => {

      beforeEach(() => {
        action = { actionType: AppStoreConstants.AUTHENTICATE }
        AppStore.TimeMachine.update = sinon.stub().returns(true);
        AppStore.handleAction(action);
      });

      it("passes the new user to the Time Machine", () => {
        let viewModel = { waypoints: 'user' };
        expect(AppStore.TimeMachine.update).calledWith({ user: 'yeehaa', viewModel });
      });
    });

    describe("set view model", () => {
      let current;

      beforeEach(() => {
        current = state.levels;
        action = { actionType: AppStoreConstants.SET_VIEW_MODEL, selection }

        AppStore.handleAction(action);
      });

      it("calls the view model set function", () => {
        expect(AppStore.ViewModel.set).calledWith({ current, selection });
      });

      it("passes the selection to the Time Machine", () => {
        let levels = selection;
        expect(AppStore.TimeMachine.update).calledWith({ levels });
      });

      it("emits a change", () => {
        expect(AppStore.emitChange).called;
      });
    });

    describe("switch between modes", () => {

      beforeEach(() => {
        action = {
          actionType: AppStoreConstants.SWITCH_MODE,
          mode: 'learn'
        }
        AppStore.TimeMachine.update = sinon.stub().returns(true);
        AppStore.handleAction(action);
      });

      it("passes the new user to the Time Machine", () => {
        let modes = {
          learn: 'active',
          curate: ''
        }
        expect(AppStore.TimeMachine.update).calledWith({ modes });
      });

      it("emits a change", () => {
        expect(AppStore.emitChange).called;
      });
    });

    describe("move history back", () => {

      beforeEach(() => {
        action = { actionType: AppStoreConstants.REVERT_HISTORY }
      });

      describe("if changes are accepted", () => {

        beforeEach(() => {
          AppStore.TimeMachine.revertHistory = sinon.stub().returns(true);
          AppStore.handleAction(action);
        });

        it("should pass the new user to the Time Machine", () => {
          expect(AppStore.TimeMachine.revertHistory).called;
        });

        it("should emit a change", () => {
          expect(AppStore.emitChange).called;
        });
      });

      describe("if changes are declined", () => {

        beforeEach(() => {
          AppStore.TimeMachine.revertHistory = sinon.stub().returns(false);
          AppStore.handleAction(action);
        });

        it("should pass the new user to the Time Machine", () => {
          expect(AppStore.TimeMachine.revertHistory).called;
        });

        it("should emit a change", () => {
          expect(AppStore.emitChange).not.called;
        });
      });
    });

    describe("move history forward", () => {

      beforeEach(() => {
        action = { actionType: AppStoreConstants.FORWARD_HISTORY }
      });

      describe("if changes are accepted", () => {

        beforeEach(() => {
          AppStore.TimeMachine.forwardHistory = sinon.stub().returns(true);
          AppStore.handleAction(action);
        });

        it("should pass the new user to the Time Machine", () => {
          expect(AppStore.TimeMachine.forwardHistory).called;
        });

        it("should emit a change", () => {
          expect(AppStore.emitChange).called;
        });
      });

      describe("if changes are declined", () => {

        beforeEach(() => {
          AppStore.TimeMachine.forwardHistory = sinon.stub().returns(false);
          AppStore.handleAction(action);
        });

        it("should pass the new user to the Time Machine", () => {
          expect(AppStore.TimeMachine.forwardHistory).called;
        });

        it("should emit a change", () => {
          expect(AppStore.emitChange).not.called;
        });
      });
    });
  });
});

function createPropertyStub(object, propertyName, state){
  Object.defineProperty(object, propertyName, {
    get(){ return { toJS(){ return state; } } }
  });
}
