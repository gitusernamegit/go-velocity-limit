import {  ChangeEvent, FC, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { createClearErrorAction, createUploadActionCreator } from '../store/Actions/ProcessActions'
import { LoadResponse, processRecordsApiCall } from '../store/Data'
import { AppState } from '../store/Store'

interface Props {
    output?: string,
    processing?: boolean,
    processed?: boolean,
    error?: string,
    processRecords?: (input: string) => void,
    processRecordsApiCall?: (input: string) => Promise<LoadResponse>
}

const Uploader: FC<Props> = ({output = "", processRecords, processing = false, processed = false, error = ""}) => {

    const dispatch = useDispatch();
    const [input, setInput] = useState("")

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        
        if(error){
            handleClear()
        }

        if(!processing){
            setInput(e.currentTarget.value)
        }
    }

    const handleClear = () => { 
         setInput("")
         dispatch(createClearErrorAction())
    }

    const outputEl = !error && processed ? <div>
        <div>
            Output:
        </div>
        <textarea readOnly className="text-area" value={output}></textarea>
    </div> : "";

    const clearButton = !processing && input ? <button onClick={() => handleClear()}>Clear</button> : ""
    const inputButton = !processing && input && processRecords != null ? <button onClick={() => processRecords(input)}>{ error ? "Try again" : "Process"}</button> : ""
    const errorMsg = !processing && error ? <div className="error-message">Unable to processs due to following error: {error}</div> : ""
    const spinner = processing ? <div className="spinner"></div> : ""

    return <div>
        <div>
            <div>
        {errorMsg}
                <div>
                    Input:
                </div>
                <div className="relative">
                    {spinner}
                    <textarea className="text-area" value={input} onChange={handleInputChange} placeholder="Insert your input here ..."></textarea>
                </div>
            </div>
        </div>
        
        {inputButton}
        {clearButton}
        {outputEl}
    </div>
}

const mapStateToProps = (store: AppState) => {
    return {
        processing: store.processState.processing,
        processed: store.processState.processed,
        output: store.processState.output,
        error: store.processState.error
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>{

    const uploadActionCreator = createUploadActionCreator();

    return {
        processRecords: (input: string) => dispatch(uploadActionCreator(input))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploader)