import { createAsyncThunk } from "@reduxjs/toolkit"
import { Workspace, Workspaces } from "./types"
import axios from "axios"

import { dropDownNodes } from "./init-workspace-state"
import { CurveConnection, CurveConnectionList } from "../canvas-curves"

const BACKENDURL = "http://localhost:3001"

const defaultWS = {
    "name": "First workspace - hello world",
    "id": 0,
    "nodes": [],
    "initNodes": [],
    "triggerCalc": false,
    "fieldPosition": {
        "x": 0,
        "y": 20
    },
    "curveConnections": []
}

export const getWorkspaceFromBackend = createAsyncThunk(
    "workspace/getWorkspaceFromBackend",
    async (input: {authToken: string}, thunkAPI) => {

        try {
            const result = await axios({
                method: "post",
                url: BACKENDURL,
                headers: {
                    'Authorization': 'Bearer ' + input.authToken,
                    'Content-Type': `application/json`,
                    'Accept'      : `application/json`,
                },
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
            return {workspace: newWorkspace, curveConnections: curConnections}

        } catch (e) {
            console.error(e)
            return {workspace: defaultWS, curveConnections: []}
        }
        
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
    async (input: {authToken: string, curWorkspace: Workspace, curveConnections: CurveConnection[]}, thunkAPI) => {

        const wsToUpload = {
            id: input.curWorkspace.id,
            name: input.curWorkspace.name,
            nodes: JSON.parse(JSON.stringify(input.curWorkspace.nodes)),
            curveConnections: JSON.parse(JSON.stringify(input.curveConnections)),
            fieldPosition: JSON.parse(JSON.stringify(input.curWorkspace.fieldPosition))
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
            method: "post",
            url: BACKENDURL,
            headers: {
                'Authorization': 'Bearer ' + input.authToken,
                'Content-Type': `application/json`,
                'Accept'      : `application/json`,
            },
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