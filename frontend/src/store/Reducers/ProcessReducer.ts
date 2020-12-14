import { Reducer } from "redux";
import { ProcessActions } from "../Actions/ProcessActions";
import { ProcessAction } from "../Constants/ActionTypes";

export interface ProcessState
{
    processed: boolean,
    processing: boolean,
    input: string,
    output?: string
    error?: string
}

const initialState : ProcessState = {
    processed: false,
    processing: false,
    input: "",
    output: "",
    error: ""
}

export const processReducer : Reducer<ProcessState, ProcessActions> = (state = initialState, action: ProcessActions) =>
{
    switch(action.type){
        case ProcessAction.ProcessingRecords:
            return {
                ...state,
                processing: true
            }
        case ProcessAction.ProcessedRecords:
            return {
                ...state,
                output: action.output,
                processing: false,
                processed: true,
                error: action.error,
            }
        case ProcessAction.ClearError:
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