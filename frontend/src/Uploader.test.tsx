import React, { Dispatch } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import Uploader from './components/Uploader';
import { Provider } from 'react-redux';
import {  configureStore } from './store/Store';
import ReactDOM from 'react-dom';
import { ApiDispatch, ClearErrorAction, createClearErrorAction, createProcessedRecordsAction, createProcessingRecordsAction, createUploadActionCreator, ProcessActions, ProcessRecords } from './store/Actions/ProcessActions';
import { LoadResponse } from './store/Data';
import { ThunkDispatch } from 'redux-thunk';
import { ProcessAction } from './store/Constants/ActionTypes';
import { Action, AnyAction } from 'redux';

let container: any;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

test('When the Upload component is rendered at first, it should render the input textarea and no buttons and no output', () => {
    const store = configureStore();
    const { getByPlaceholderText } = render(<Provider store={store}><Uploader /></Provider>);
    
    const input = getByPlaceholderText('Insert your input here ...');
    
    expect(input).not.toBeNull();

    const buttons = container.querySelectorAll('button')
    expect(buttons[0]).not.toBeNull();
    expect(buttons[1]).not.toBeNull();
    
    const output = container.querySelectorAll('textarea')[1];
    expect(output).toBeUndefined();
  });


it('When the Upload input is filled, it should show Process and Clear button', () => {
  const store = configureStore();
  act(() => {
    ReactDOM.render(<Provider store={store}><Uploader /></Provider>, container);
  });

  EnterInput();
  const buttons = container.querySelectorAll('button')

  const processButton = buttons[0];
  expect(processButton.textContent).toBe("Process");

  const clearButton = buttons[1];
  expect(clearButton.textContent).toBe("Clear");
});

it('When input is modified, it should clear the error message', () => {
  const store = configureStore();
  const errorText = "errorText";
  
  act(() => {
    ReactDOM.render(<Provider store={store}><Uploader error={errorText} /></Provider>, container);
  });

  store.dispatch(createProcessedRecordsAction({error: errorText, output: ""}));

  let errorMessage = container.querySelectorAll('.error-message')[0]
  expect(errorMessage.innerHTML.endsWith(errorText)).toBeTruthy(); 

  store.dispatch(createClearErrorAction());

  errorMessage = container.querySelectorAll('.error-message')[0]
  expect(errorMessage).toBeUndefined();
});

it('When the input is processing, it should hide Process and Clear buttons and show "loading" spinner', () => {
  
  const store = configureStore();

  act(() => {
    ReactDOM.render(<Provider store={store}><Uploader /></Provider>, container);
  });

  store.dispatch(createProcessingRecordsAction());

  const spinner = container.querySelectorAll('.spinner')[0]
  expect(spinner).not.toBeNull();

  const buttons = container.querySelectorAll('button')
  expect(buttons[0]).not.toBeNull();
  expect(buttons[1]).not.toBeNull();

});

it('When the input is processed with error, it should hide spinner and output and show error message', () => {

  const errorText = "errorText";
  const store = configureStore();

  act(() => {
    ReactDOM.render(<Provider store={store}><Uploader /></Provider>, container);
  });

  store.dispatch(createProcessedRecordsAction({error: errorText, output: ""}));

  const spinner = container.querySelectorAll('.spinner')[0]
  expect(spinner).toBeUndefined();

  const output = container.querySelectorAll('textarea')[1];
  expect(output).toBeUndefined();

  const errorMessage = container.querySelectorAll('.error-message')[0]
  expect(errorMessage.innerHTML.endsWith(errorText)).toBeTruthy(); 
});

it('When the input is processed with no error, it should show output and Procces button', () => {

  const someOutput = "some output";
  const store = configureStore();

  act(() => {
    ReactDOM.render(<Provider store={store}><Uploader /></Provider>, container);
  });

  store.dispatch(createProcessedRecordsAction({error: "", output: someOutput}));

  const spinner = container.querySelectorAll('.spinner')[0]
  expect(spinner).toBeUndefined();

  const output = container.querySelectorAll('textarea')[1];
  expect(output.value).toBe(someOutput);
});

it('When the input is processing, it should follow specific actions order', async () => {

  const expectedActionOrder = [ProcessAction.ProcessingRecords, ProcessAction.ProcessApiCall, ProcessAction.ProcessedRecords];
  
  const someOutput = "some output";
  const store = configureStore();

  act(() => {
    ReactDOM.render(<Provider store={store}><Uploader /></Provider>, container);
  });

  let actualOrder: string[] = []

  const voidApiDispatch: ApiDispatch  =  {
      apiCall: (input: string) =>  new Promise<LoadResponse>((resolve) => {
         actualOrder.push(ProcessAction.ProcessApiCall)
         resolve({output: "", error: ""})
      }),
      dispatch: (action: any) => actualOrder.push(action.type)
  }

  const mockuploadActionCreator = createUploadActionCreator(voidApiDispatch);
  await store.dispatch<any>(mockuploadActionCreator("input"))

  for(let index =0; index < expectedActionOrder.length; index++){
    expect(expectedActionOrder[index]).toBe(actualOrder[index]);
  }
})

function EnterInput(input?: string) {
  const textarea = container.querySelector('textarea');
  fireEvent.focus(textarea);

  fireEvent.change(textarea, {
    target: {
      value: input ?? 'any-input'
    }
  });
}