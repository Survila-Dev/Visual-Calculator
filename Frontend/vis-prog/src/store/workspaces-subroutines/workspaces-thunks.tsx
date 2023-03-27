import { createAsyncThunk } from "@reduxjs/toolkit"
import { Workspace, Workspaces } from "./types"
import axios from "axios"

import { workspacesStateActions } from "./index-workspaces"
import { dropDownNodes } from "./init-workspace-state"
import { CurveConnection, CurveConnectionList } from "../canvas-curves"

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

const BACKENDURL = "http://localhost:4000"

export const getWorkspaceFromBackend = createAsyncThunk(
    "workspace/getWorkspaceFromBackend",
    async (input: {authToken: string}, thunkAPI) => {

        console.log("Access token:")
        console.log(input.authToken)



        try {
            console.log("Getting workspace")

            const result = await fetch(
                BACKENDURL, {
                    method: "post",
                    // mode: "cors",
                    headers: {
                        Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Il96RlZ1Uk5BVGlwdnIyYmVtOFRMdyJ9.eyJpc3MiOiJodHRwczovL2Rldi1odXFlZGdqdHViY213cGRlLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwMTUwMDY0NDMxNjI4NzcwNzAzOSIsImF1ZCI6WyJodHRwczovL3Zpc3Byb2cuYmFja2VuZC5jb20iLCJodHRwczovL2Rldi1odXFlZGdqdHViY213cGRlLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2Nzk4OTI2ODgsImV4cCI6MTY3OTk3OTA4OCwiYXpwIjoiYm1pRUFTUTZPVkdreUVmRWRBZnh0TVQ1a2NSN2FKam8iLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.KcLMKAkTC7naqTWArYuFS5V4TxFlj_dIuPpEhtBizTwyRNDtQVhS1c0mR57Rl_9QRC-vaK4n8e8NvvV52OnjQvG7kcTBWCr_WIJ9sQRm1EKTrOtHLu60UUC_nuSRL6p2s-IRBSFsRJoWl3RBchOl4YuSWwiR7e1GevxBUbj8lkXhRgknyzNVBIwQCirkUgFzaRJsTSMhpdnsZHpxx1ay0mR6aO1lz4zLdZ9Wsc50igVpeQbRUOcgpbJOlOCys49Zevb2k2mcbYI2Bi8CTPn7eH7dEK2KCTgcrLEFFxP7iAM3psnnuw6xfGvgnvg4AVHBYN_tI_aNo3_5qWxiEFNrHw",
                        "Access-Control-Allow-Origin": "*",
                        'Content-type': 'application/json'
                    },
                    body: `
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
            )
            console.log("Fetch successful.")

            // const result = await axios.post(
            //     BACKENDURL,
            //     {
            //         // withCredentials: false,
            //         headers: {
            //             Authorization: 'Bearer ' + input.authToken, //"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Il96RlZ1Uk5BVGlwdnIyYmVtOFRMdyJ9.eyJpc3MiOiJodHRwczovL2Rldi1odXFlZGdqdHViY213cGRlLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJWdGYySTNlVDhNT0NKVERzSlV3ZTB5bmx2N24yaG1PNkBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly92aXNwcm9nLmJhY2tlbmQuY29tIiwiaWF0IjoxNjc5ODE0NTIxLCJleHAiOjE2Nzk5MDA5MjEsImF6cCI6IlZ0ZjJJM2VUOE1PQ0pURHNKVXdlMHlubHY3bjJobU82IiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.r9IGVcefTX584Xb2YR6KT94iDvbK2zKJmkSkn8gCG98Dx6QY7wSpEgIPp_p3lsuNXbPF6zuv9lS5tLuB2tMrcdA2NiE6Wl7Wf7uOmabIk7CcTQcvV3YG0QLvQqNhUgrvf5ixsWmTppXsGSrbPTZBqWT-xshesVwB2RX576dwZNMrjlLXEbtjeZ7NKkC86FgObdU-VY0v33AJFBLW3Xiy2LPmAMnQszNe1SvyCStvYmKQcJyXPMwq_ZMQfONPwJq1uVVKzxM5WE7z1NJ1KHrxa9bkZG8Gw_otEmPaMwdDI1QYiqQ5jD2LFBzYlcC8MR4mttZImVaxWtpHgfNE5_bFwg",
            //             'Content-Type': `application/json`,
            //             'Accept'      : `application/json`,
            //             "Access-Control-Allow-Origin": "*",
                        
            //         },
            //         data: {
            //             query: `
            //                 query {
            //                     currentWorkspace {
            //                         id
            //                         name
            //                         fieldPosition {
            //                             x
            //                             y
            //                         }
            //                         nodes {
            //                         id
            //                         type
            //                         position {
            //                             x
            //                             y
            //                         }
            //                         connections {
            //                             id
            //                             nodeId
            //                             portSelf
            //                             otherNodeId
            //                             portOther
            //                         }
            //                         value
            //                         fullyConnected
                                    
            //                         }
            //                         curveConnections {
            //                             firstNodeId
            //                             firstPortId
            //                             secondNodeId
            //                             secondPortId
            //                             firstPortPosition {
            //                                 x
            //                                 y
            //                             }
            //                             secondPortPosition {
            //                                 x
            //                                 y
            //                             }
            //                         }
                                    
            //                     }
            //                 }
            //                 `
            //         }
            // })
            // const newWorkspace = result.data.data.currentWorkspace
            // newWorkspace.initNodes = dropDownNodes
            // const curConnections = JSON.parse(JSON.stringify(newWorkspace.curveConnections))
            // delete newWorkspace.curveConnections
            return {workspace: defaultWS, curveConnections: []}

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
    console.log("String literal used in axios request:")
    console.log(outputText)
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
            url: BACKENDURL,
            method: "post",
            headers: {
                'Authorization': 'Bearer ' + input.authToken,
                'Content-Type': `application/json`,
                'Accept'      : `application/json`,
                "Access-Control-Allow-Origin": "*",
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