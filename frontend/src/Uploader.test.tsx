import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import Uploader from './components/Uploader';
import { Provider } from 'react-redux';
import {  configureStore } from './store/Store';
import ReactDOM from 'react-dom';

let container: any;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

test('When the Upload component is rendered at first, it should contain the input textarea and no buttons and no output', () => {
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

it('When the Clear button is clicked, it should clear the input value and hide Clear button', () => {
  const store = configureStore();
  
  act(() => {
    ReactDOM.render(<Provider store={store}><Uploader /></Provider>, container);
  });

  EnterInput();

  let clearButton = container.querySelectorAll('button')[1]
  fireEvent.focus(clearButton)
  fireEvent.click(clearButton,)
  clearButton = container.querySelectorAll('button')[1]
  expect(clearButton).toBeUndefined();
  
  const input = container.querySelector('textarea');
  expect(input.value).toBe("");
});

it('When the Process button is clicked, it should hide Process and Clear buttons and show "loading" spinner', () => {
  const store = configureStore();
  
  act(() => {
    ReactDOM.render(<Provider store={store}><Uploader /></Provider>, container);
  });

  EnterInput();

  const processButton = container.querySelectorAll('button')[1]
  fireEvent.focus(processButton)
  fireEvent.click(processButton)

  expect(container.firstChild.classList.contains('spinner')).not.toBeNull();

  const buttons = container.querySelectorAll('button')
  expect(buttons[0]).not.toBeNull();
  expect(buttons[1]).not.toBeNull();
});

function EnterInput() {
  const input = container.querySelector('textarea');
  fireEvent.focus(input)

  fireEvent.change(input, {
    target: {
      value: 'input'
    }
  })
}