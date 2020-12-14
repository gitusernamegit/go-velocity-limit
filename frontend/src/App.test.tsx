import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { configureStore } from './store/Store';
import { uploadActionCreator } from './store/Actions/ProcessActions';


/*
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/

describe('actions', () => {
  it('should create an action to add a todo', () => {
    /*
    const text = 'Finish docs'
    const expectedAction = {
      type: types.ADD_TODO,
      text
    }
    */
    const expectedAction = ""
    const result = uploadActionCreator("input");
    expect(uploadActionCreator("input")).toEqual(expectedAction)
  })
})