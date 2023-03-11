import { createAsyncThunk } from "@reduxjs/toolkit"
import { Workspace } from "./types"
import axios from "axios"

// Thunks:
export const updateWorkspacesForServer = createAsyncThunk(
    "workspace/workspacesUpdateToServer",
    async (infoForUpdate: {idWS: number, updatedWS: Workspace}, thunkAPI) => {
        // Async logic and return a Promise

        //ToDO Update the server and return if OK
    }
)

export const getWorkspacesForOverview = createAsyncThunk(
    "workspace/getWorkspacesForOverview",
    async () => {
        //ToDo Get back a list of workspaces from server with names, ids and return it
    }
)

export const getCurrentWorkspace = createAsyncThunk(
    "workspace/getSingleWorkspace",
    async () => {
        const curWorkspace = axios({
            url: process.env.BACKENDURL,
            method: "get",
            data: {
                query: `
                    {
                        currentWorkspace {
                            id
                            name
                            nodes {
                            id
                            type
                            position {
                                x
                                y
                            }
                            connections {
                                id
                            }
                            value
                            fullyConnected
                            }
                        }
                    }
                    `
            }
        })
        //ToDO Get a Workspace object from server and return it
    }
)