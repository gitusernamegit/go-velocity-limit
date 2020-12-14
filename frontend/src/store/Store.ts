import {Store, applyMiddleware, createStore, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {  ProcessActions } from './Actions/ProcessActions'
import { processReducer, ProcessState } from './Reducers/ProcessReducer'

export interface AppState {
    processState: ProcessState
}

type AppActions = ProcessActions

const rootReducer = combineReducers<AppState>({
    processState: processReducer,
  });

export function configureStore(): Store<AppState> {
    const store = createStore(rootReducer, undefined, applyMiddleware(thunk))
    return  store;
}

