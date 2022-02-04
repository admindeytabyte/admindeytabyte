import * as PageActions from '../actions/page.actions';
import { PageData } from '../../interfaces/page-data';

export type Action = PageActions.All;

// Default app state
const defaultData: PageData = {
  title: '',
  loaded: false,
  breadcrumbs: null,
  fullFilled: false
};

// Helper function to create new state object
const newState = (state, newData) => {
  return Object.assign({}, state, newData);
}

// Reducer function
export function pageDataReducer(state: any = defaultData, action: Action) {
  switch (action.type) {
    case PageActions.SET: {
      return action.data;
    }
    case PageActions.UPDATE: {
      return newState(state, action.data);
    }
    case PageActions.RESET: {
      return state = defaultData;
    }
    default: {
      return state;
    }
  }
}
