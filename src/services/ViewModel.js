import { Map, Stack }  from 'immutable';
import R from 'ramda';

class ViewModel {

  constructor(api){
    this.api = api;
  }

  async get(appState){
    let { user, viewModel } = appState;
    let waypoints = await this.api();
    let waypoint = R.find(R.propEq('id', viewModel.waypoint), waypoints);
    let checkpoint = waypoint ? R.find(R.propEq('id', viewModel.checkpoint), waypoint.checkpoints) : undefined;
    let resource = checkpoint ? R.find(R.propEq('id', viewModel.resource), checkpoint.resources) : undefined;

    if(resource){
      return {
        model: resource,
        collection: []
      }
    }

    if(checkpoint){
      return {
        model: checkpoint,
        collection: checkpoint.resources
      }
    }

    if(waypoint){
      return {
        model: waypoint,
        collection: waypoint.checkpoints
      }
    }

    if(waypoints){
      let title = '_Unacademic';
      let type = 'waypoints';
      let model = { title, type };
      let collection = user ? [waypoints[1], waypoints[2]] : waypoints;
      return { model, collection }
    }
  }

  set({ current, selection }){
    let { type, id } = selection;
    let proposal;

    switch(type){
      case 'waypoints':
        proposal = {
          waypoints: id || current['waypoints'],
          waypoint: false,
          checkpoint: false,
          resource: false
        }
        break;
      case 'waypoint':
        proposal = {
          waypoints: current['waypoints'],
          waypoint: id || current['waypoint'],
          checkpoint: false,
          resource: false
        }
        break;
      case 'checkpoint':
        proposal = {
          waypoints: current['waypoints'],
          waypoint: current['waypoint'],
          checkpoint: id || current['checkpoint'],
          resource: false
        }
        break;
      case 'resource':
        proposal = {
          waypoints: current['waypoints'],
          waypoint: current['waypoint'],
          checkpoint: current['checkpoint'],
          resource: id || current['resource']
        }
        break;
    }
    return proposal;
  }
}

export default ViewModel;
