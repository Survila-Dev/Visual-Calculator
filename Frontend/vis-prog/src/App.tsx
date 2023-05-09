import { useAuth0 } from "@auth0/auth0-react";
import React from 'react';
import { Routes, Route } from "react-router-dom";
import { PageLoading } from "./components/page-loading"
import { WorkspaceEditor } from "./pages/workspace-editor"


const App: React.FC = () => {

  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div>
        <PageLoading/>
      </div>
    );
  }

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
