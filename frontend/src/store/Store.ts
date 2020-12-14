import {Store, Action, ActionCreator, Reducer, Dispatch, applyMiddleware, createStore, combineReducers} from 'redux'
import thunk, {ThunkAction} from 'redux-thunk'
import {processLoads} from './Data'

interface UploadState
{
    processed: boolean,
    processing: boolean,
    input: string,
    output?: string
    error?: string
}

export interface AppState {
    uploadState: UploadState
}

const initialState : UploadState = {
    processed: false,
    processing: false,
    input: "",
    output: "",
    error: ""
}

export interface ProcessingRecords extends Action<'ProcessingRecords'> {}
export interface ProcessedRecords extends Action<'ProcessedRecords'> {
    output?: string
    error?: string
}

export interface ProcessRecords extends Action<'ProcessRecords'> {
    input: string
}

export interface ClearError extends Action<'ClearError'> {}

type AppActions = ProcessRecords | ProcessingRecords | ProcessedRecords | ClearError

export const uploadActionCreator: ActionCreator<ThunkAction<Promise<void>, string, null, AppActions>> = (input : string) => {
        return async (dispatch: Dispatch) => {

            var processingRecords: ProcessingRecords = {
                type: 'ProcessingRecords'
            }

            dispatch(processingRecords)

            let loadResponse = await processLoads(input);

            let uploadAction: ProcessedRecords = {
                type: 'ProcessedRecords',
                ...loadResponse
            }

            dispatch(uploadAction)
        }
}

export const clearErrorActionCreator: ActionCreator<ClearError> = () => ({ type: 'ClearError' })

const uploadReducer : Reducer<UploadState, AppActions> = (state = initialState, action: AppActions) =>
{
    switch(action.type){
        case 'ProcessingRecords':
            return {
                ...state,
                processing: true
            }
        case 'ProcessedRecords':
            return {
                ...state,
                output: action.output,
                processing: false,
                processed: true,
                error: action.error,
            }
        case 'ClearError':
            return {
                ...state,
                error: "",
                processed: false
            }
        default: 
            neverReached();
    }

    return state
}

const neverReached = () => null;

const rootReducer = combineReducers<AppState>({
    uploadState: uploadReducer,
  });

export function configureStore(): Store<AppState> {
    const store = createStore(rootReducer, undefined, applyMiddleware(thunk))
    return  store;
}

