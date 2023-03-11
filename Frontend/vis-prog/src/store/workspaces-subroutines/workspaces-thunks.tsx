import { createAsyncThunk } from "@reduxjs/toolkit"
import { Workspace, Workspaces } from "./types"
import axios from "axios"

import { workspacesStateActions } from "./index-workspaces"
import { dropDownNodes } from "./init-workspace-state"

const BACKENDURL = "http://localhost:4000/"

// export const getWorkspaceFromBackend = async (store: any) => {
//     return async (dispatch: any) => {

        
//     }
// }

// export const uploadWorkspaceToBackend = async (state: Workspaces) => {

//     return async (dispatch: any) => {

//         dispatch(workspacesStateActions.updateWorkspacesStatusPost({newStatus: "loading"}))
//         try {
//             const newWorkspace: Workspace = await axios({
//                 url: process.env.BACKENDURL,
//                 method: "post",
//                 data: {
//                     query: `
//                         updateWholeWorkspace(workspace: ${JSON.stringify(state.currentWS)}) {
//                             id
//                         }
//                         `
//                 }
//             })
//             dispatch(workspacesStateActions.updateWorkspace({updatedWorkspace: newWorkspace}))
//             dispatch(workspacesStateActions.updateWorkspacesStatusPost({newStatus: "idle"}))
//         } catch (err) {
//             dispatch(workspacesStateActions.updateWorkspacesStatusPost({newStatus: "failed"}))
//         }
//     }

// }

// Thunks:
export const getWorkspaceFromBackend = createAsyncThunk(
    "workspace/getWorkspaceFromBackend",
    async (thunkAPI) => {
        const result = await axios({
            url: BACKENDURL, //process.env.BACKENDURL,
            method: "post",
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
                                portSelf
                                otherNodeId
                                portOther
                              }
                              value
                              fullyConnected
                            }
                          }
                    `
            }
        })
        
        const newWorkspace = result.data.data.currentWorkspace
        newWorkspace.initNodes = dropDownNodes
        // newWorkspace.nodes = []
        console.log(newWorkspace)
        return newWorkspace
    }
)

const removeQuotesFromJSONStringifyKeys = (inputText: string) => {
    let outputText: string = ""
    let removeQuote = true
    for (let i = 0; i < inputText.length; i++) {
        if (inputText[i] === "{" || inputText[i] === ",") {
            removeQuote = true
        }
        if (inputText[i] === ":") {
            removeQuote = false
        }
        if (!(removeQuote && inputText[i] === '"')) {
            outputText += inputText[i]
        }
    }
    return outputText
} 

export const uploadWorkspaceToBackend = createAsyncThunk(
    "workspace/uploadWholeWorkspaceToBackend",
    async (curWorkspace: Workspace, thunkAPI) => {

        const wsToUpload = {
            id: curWorkspace.id,
            name: curWorkspace.name,
            nodes: curWorkspace.nodes
        }

        for (let i = 0; i < wsToUpload.nodes.length; i++) {
            wsToUpload.nodes[i].value = wsToUpload.nodes[i].value as string 
        }

        console.log(`
        mutation {
            updateWholeWorkspace(workspace: ${removeQuotesFromJSONStringifyKeys(JSON.stringify(wsToUpload))}) {
                id
            }
        }
        `)
        const result = await axios({
            url: BACKENDURL,
            method: "post",
            data: {
                query: `
                    mutation updateWS {
                        updateWholeWorkspace(workspace: ${removeQuotesFromJSONStringifyKeys(JSON.stringify(wsToUpload))}) {
                            id
                        }
                    }
                    `
            }
        })
        
        return result.data.data.currentWorkspace
    } 
)

// export const getWorkspacesForOverview = createAsyncThunk(
//     "workspace/getWorkspacesForOverview",
//     async () => {
//         //ToDo Get back a list of workspaces from server with names, ids and return it
//     }
// )

// export const getCurrentWorkspace = createAsyncThunk(
//     "workspace/getSingleWorkspace",
//     async () => {
//         const curWorkspace = axios({
//             url: process.env.BACKENDURL,
//             method: "get",
//             data: {
//                 query: `
//                     {
//                         currentWorkspace {
//                             id
//                             name
//                             nodes {
//                             id
//                             type
//                             position {
//                                 x
//                                 y
//                             }
//                             connections {
//                                 id
//                             }
//                             value
//                             fullyConnected
//                             }
//                         }
//                     }
//                     `
//             }
//         })
//         //ToDO Get a Workspace object from server and return it
//     }
// )