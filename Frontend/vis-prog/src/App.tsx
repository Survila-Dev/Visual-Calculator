import { useAuth0 } from "@auth0/auth0-react";
import React from 'react';
// import { actions, useAppDispatch, useAppSelector, changeAsync } from "./store/index";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar"
import { PageLoading } from "./components/page-loading"
import { WorkspaceEditor } from "./pages/workspace-editor"


function App() {

  // const count = useAppSelector((state) => state.counterRed.counter)
  // const dispatch = useAppDispatch();

  const { isLoading } = useAuth0();

  // const isLoading = false

  if (isLoading) {
    return (
      <div>
        <PageLoading/>
      </div>
    );
  }

  // const handleClick = (e: React.FormEvent) => {
  //   dispatch(actions.change(12))
  // }

  // const handleAsyncClick = (e: React.FormEvent) => {
  //   dispatch(changeAsync(20)) 
  // }

  return (
      <Routes>
        <Route path = "/" element = {
          <WorkspaceEditor/>
        }/>
        <Route path = "*" element = {"nothing found"}/>
      </Routes>
  );
}

export default App;
