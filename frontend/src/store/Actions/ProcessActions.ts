import { Action, ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { ProcessAction } from "../Constants/ActionTypes";
import { LoadResponse, processRecordsApiCall } from "../Data";

export type ProcessActions = ProcessRecords | ProcessingRecords | ProcessedRecords | ClearErrorAction

export interface ProcessingRecords extends Action<ProcessAction.ProcessingRecords> {}
export interface ProcessedRecords extends Action<ProcessAction.ProcessedRecords> {
    output?: string
    error?: string
}

export interface ProcessRecords extends Action<ProcessAction.ProcessRecords> {
    input: string
}

export interface ClearErrorAction extends Action<ProcessAction.ClearError> {}

export const createProcessedRecordsAction = (loadResponse: LoadResponse) => ({ type: ProcessAction.ProcessedRecords, ...loadResponse })
export const createProcessingRecordsAction = () => ({ type: ProcessAction.ProcessingRecords })
export const createClearErrorAction = () => ({ type: ProcessAction.ClearError })

export interface ApiDispatch {
    apiCall: (input: string) => Promise<LoadResponse>
    dispatch: (action: any) =>  void
}

export const createUploadActionCreator = (customeDispatcherAPI: ApiDispatch | null = null) : 
    ActionCreator<ThunkAction<Promise<void>, string, null, ProcessActions>> => (input : string) => {

    return async (dispatch: Dispatch) => {
        
        const dispatcherAPI: ApiDispatch = customeDispatcherAPI ?? {
            apiCall: processRecordsApiCall,
            dispatch: dispatch
        };

        dispatcherAPI.dispatch(createProcessingRecordsAction());

        const loadResponse = await dispatcherAPI.apiCall(input);
        
        dispatcherAPI.dispatch(createProcessedRecordsAction(loadResponse));
    }
}