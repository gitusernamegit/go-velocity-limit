import {  ChangeEvent, FC, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { clearErrorActionCreator, uploadActionCreator } from '../store/Actions/ProcessActions'
import { AppState } from '../store/Store'

interface Props {
    output?: string,
    processing?: boolean,
    processed?: boolean,
    error?: string,
    processRecords: (input: string) => void
}

const Uploader: FC<Props> = ({output = "", processRecords, processing = false, processed = false, error = ""}) => {

    const dispatch = useDispatch();
    const [input, setInput] = useState("")

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        
        if(error){
            handleClean()
        }

        if(!processing){
            setInput(e.currentTarget.value)
        }
    }

    const handleClean = () => { 
         setInput("")
         dispatch(clearErrorActionCreator())
    }

    const outputEl = !error && processed ? <div>
        <div>
            Output:
        </div>
        <textarea className="text-area" value={output}></textarea>
    </div> : "";

    const clearButton = !processing && input ? <button onClick={() => handleClean()}>Clear</button> : ""
    const inputButton = !processing && input ? <button onClick={() => processRecords(input)}>{ error ? "Try again" : "Process"}</button> : ""
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
    return {
        processRecords: (input: string) => dispatch(uploadActionCreator(input))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploader)