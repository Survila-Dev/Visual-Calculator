import React from 'react';
import { actions, useAppDispatch, useAppSelector, changeAsync } from "./store/index";
import './App.css';

function App() {

  const count = useAppSelector((state) => state.counterRed.counter)
  const dispatch = useAppDispatch();

  const handleClick = (e: React.FormEvent) => {
    dispatch(actions.change(12))
  }

  const handleAsyncClick = (e: React.FormEvent) => {
    dispatch(changeAsync(20)) 
  }

  return (
    <div className="App">
      <p>{count}</p>  
      <button onClick = {handleClick}>Click me</button>
      <button onClick = {handleAsyncClick}>Click me</button>
    </div>
  );
}

export default App;
