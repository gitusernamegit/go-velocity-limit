import { Action, ActionCreator, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { ProcessAction } from "../Constants/ActionTypes";
import { processLoads } from "../Data";

export type ProcessActions = ProcessRecords | ProcessingRecords | ProcessedRecords | ClearInputAction


export interface ProcessingRecords extends Action<ProcessAction.ProcessingRecords> {}
export interface ProcessedRecords extends Action<ProcessAction.ProcessedRecords> {
    output?: string
    error?: string
}

export interface ProcessRecords extends Action<ProcessAction.ProcessRecords> {
    input: string
}

export interface ClearInputAction extends Action<ProcessAction.ClearInput> {}

export const uploadActionCreator: ActionCreator<ThunkAction<Promise<void>, string, null, ProcessActions>> = (input : string) => {
    return async (dispatch: Dispatch) => {

        var processingRecords: ProcessingRecords = {
            type: ProcessAction.ProcessingRecords
        }

        dispatch(processingRecords)

        let loadResponse = await processLoads(input);

        let uploadAction: ProcessedRecords = {
            type: ProcessAction.ProcessedRecords,
            ...loadResponse
        }

        dispatch(uploadAction)
    }
}

export const clearInputActionCreator: ActionCreator<ClearInputAction> = () => ({ type: ProcessAction.ClearInput })