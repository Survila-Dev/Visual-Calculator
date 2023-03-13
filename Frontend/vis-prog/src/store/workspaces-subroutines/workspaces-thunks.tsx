import { createAsyncThunk } from "@reduxjs/toolkit"
import { Workspace, Workspaces } from "./types"
import axios from "axios"

import { workspacesStateActions } from "./index-workspaces"
import { dropDownNodes } from "./init-workspace-state"
import { CurveConnection, CurveConnectionList } from "../canvas-curves"

const BACKENDURL = "http://localhost:4000/"

export const getWorkspaceFromBackend = createAsyncThunk(
    "workspace/getWorkspaceFromBackend",
    async (thunkAPI) => {
        const result = await axios({
            url: BACKENDURL,
            method: "post",
            data: {
                query: `
                    query {
                        currentWorkspace {
                            id
                            name
                            fieldPosition {
                                x
                                y
                              }
                            nodes {
                            id
                            type
                            position {
                                x
                                y
                            }
                            connections {
                                id
                                nodeId
                                portSelf
                                otherNodeId
                                portOther
                            }
                            value
                            fullyConnected
                            
                            }
                            curveConnections {
                                firstNodeId
                                firstPortId
                                secondNodeId
                                secondPortId
                                firstPortPosition {
                                    x
                                    y
                                }
                                secondPortPosition {
                                    x
                                    y
                                }
                            }
                            
                        }
                    }
                    `
            }
        })
        
        const newWorkspace = result.data.data.currentWorkspace
        newWorkspace.initNodes = dropDownNodes
        const curConnections = JSON.parse(JSON.stringify(newWorkspace.curveConnections))
        delete newWorkspace.curveConnections
        console.log(newWorkspace)
        console.log(curConnections)
        return {workspace: newWorkspace, curveConnections: curConnections}
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
    console.log("String literal used in axios request:")
    console.log(outputText)
    return outputText
} 

export const uploadWorkspaceToBackend = createAsyncThunk(
    "workspace/uploadWholeWorkspaceToBackend",
    async (input: {curWorkspace: Workspace, curveConnections: CurveConnection[]}, thunkAPI) => {

        const wsToUpload = {
            id: input.curWorkspace.id,
            name: input.curWorkspace.name,
            nodes: JSON.parse(JSON.stringify(input.curWorkspace.nodes)),
            curveConnections: JSON.parse(JSON.stringify(input.curveConnections))
        }

        for (let i = 0; i < wsToUpload.nodes.length; i++) {
            if (typeof wsToUpload.nodes[i].value === "number") {
                console.log("Converting to string")
                const valueToString: string = wsToUpload.nodes[i].value as any as string
                wsToUpload.nodes[i].value = valueToString.toString()
            }
            for (let j = 0; j < wsToUpload.nodes[i].connections.length; j++) {
                wsToUpload.nodes[i].connections[j].id = j
                wsToUpload.nodes[i].connections[j].nodeId = i
            }
        }

        const result = await axios({
            url: BACKENDURL,
            method: "post",
            data: {
                query: `
                    mutation {
                        updateWholeWorkspace(workspace: ${removeQuotesFromJSONStringifyKeys(JSON.stringify(wsToUpload))}) {
                            id
                        }
                    }
                    `
            }
        }
        )
        
        return result.data.data.currentWorkspace
    } 
)