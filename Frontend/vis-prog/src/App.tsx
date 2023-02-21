import { useAuth0 } from "@auth0/auth0-react";
import React from 'react';
import { actions, useAppDispatch, useAppSelector, changeAsync } from "./store/index";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar"
import { PageLoading } from "./components/page-loading"

function App() {

  const count = useAppSelector((state) => state.counterRed.counter)
  const dispatch = useAppDispatch();

  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div>
        <PageLoading/>
      </div>
    );
  }

  const handleClick = (e: React.FormEvent) => {
    dispatch(actions.change(12))
  }

  const handleAsyncClick = (e: React.FormEvent) => {
    dispatch(changeAsync(20)) 
  }

  return (
      <Routes>
        <Route path = "/" element = {
          <div className="bg-blue-100">
            <Navbar/>
            <p>{count}</p>  
            <button onClick = {handleClick}>Click me</button>
            <button onClick = {handleAsyncClick}>Click me</button>
          </div>
        }/>
        <Route path = "*" element = {"nothing found"}/>
      </Routes>
  );
}

export default App;
