import {  ChangeEvent, FC, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { AppState, clearErrorActionCreator, uploadActionCreator } from '../store/Store'

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

    const cleanButton = !processing && input ? <button onClick={() => handleClean()}>Clean</button> : ""
    const inputButton = !processing && input ? <button onClick={() => processRecords(input)}>{ error ? "Try again" : "Process"}</button> : ""
    const errorMsg = !processing && error ? <div className="error-message">Unable to processs due to following error: {error}</div> : ""
    const spinner = processing ? <div className="spinner"></div> : ""

    return <div>
        <div>
            <div>
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
        {cleanButton}
        {errorMsg}
        {outputEl}
    </div>
}

const mapStateToProps = (store: AppState) => {
    return {
        processing: store.uploadState.processing,
        processed: store.uploadState.processed,
        output: store.uploadState.output,
        error: store.uploadState.error
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) =>{
    return {
        processRecords: (input: string) => dispatch(uploadActionCreator(input))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Uploader)