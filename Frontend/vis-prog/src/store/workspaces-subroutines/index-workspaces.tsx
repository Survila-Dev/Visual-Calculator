import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addNewPortConnection, deletePortConnection } from "./add-delete-port-connection"
import { addWSNode, removeWSNode, updateWSNodePosition } from "./add-remove-update-node"
import { changeVariableAndTriggerRecalc } from "./change-variable-and-trigger-recalc"
import { workspacesInitValues } from "./init-workspace-state"
import { Coordinates2D, WSNodeType } from "./types"
import { updateWorkspace, updateWorkspacesStatusGet, updateWorkspacesStatusPost } from "./update-workspace"
import { getWorkspaceFromBackend, uploadWorkspaceToBackend } from "./workspaces-thunks"

export const findIdInNodeList = (nodeList: WSNodeType[], idToFind: number) => {
    let foundNode: (number | null) = null
    for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].id === idToFind) {
            foundNode = i
        }
    }
    if (foundNode !== null) {
        return foundNode
    } else {
        return null
    }
}

const checkIfInputValidAndEval = (input: any, evalFunction: Function) => {
    if (input) {
        evalFunction()
    }
}

export const workspacesSlice = createSlice({
    name: "workspaces",
    initialState: workspacesInitValues,
    reducers: {
        changeVariableAndTriggerRecalc,
        addWSNode,
        removeWSNode,
        addNewPortConnection,
        deletePortConnection,
        updateWSNodePosition,
        updateWorkspace,
        updateWorkspacesStatusGet,
        updateWorkspacesStatusPost,

        updateFieldPosition(
            state,
            action: PayloadAction<{newPosition: Coordinates2D}>
        ) {
            state.currentWS.fieldPosition = action.payload.newPosition
        },
        
        updatePosition(
            state,
            action: PayloadAction<{nodeId: number, portId: number, newPos: {x: number, y:number}}>) {
            
            if (state.currentCurveConnections) {
                for (let i = 0; i < state.currentCurveConnections.length; i++) {
                    if (state.currentCurveConnections[i].firstNodeId === action.payload.nodeId && state.currentCurveConnections[i].firstPortId === action.payload.portId) {
                        state.currentCurveConnections[i].firstPortPosition = action.payload.newPos
                    } else if (state.currentCurveConnections[i].secondNodeId === action.payload.nodeId && state.currentCurveConnections[i].secondPortId === action.payload.portId){
                        state.currentCurveConnections[i].secondPortPosition = action.payload.newPos
                    }
                }
            }
            
        },
        addNewConnection(
            state,
            action: PayloadAction<{
                firstNodeId: number, firstPortId: number, 
                secondNodeId: number, secondPortId: number,
                firstPortPos: {x: number, y:number},
                secondPortPos: {x: number, y:number}}>) {

            if (state.currentCurveConnections) {
                state.currentCurveConnections.push({
                    firstNodeId: action.payload.firstNodeId ,
                    firstPortId: action.payload.firstPortId,
                    secondNodeId: action.payload.secondNodeId,
                    secondPortId: action.payload.secondPortId,
                    firstPortPosition: action.payload.firstPortPos,
                    secondPortPosition: action.payload.secondPortPos
                })
            }

        },
        deleteConnection(
            state,
            action: PayloadAction<{
                nodeId: number, portId: number}>){

            if (state.currentCurveConnections) {
                for (let i = state.currentCurveConnections.length-1; i >= 0; i--) {
                    if (state.currentCurveConnections[i].firstNodeId === action.payload.nodeId && state.currentCurveConnections[i].firstPortId === action.payload.portId) {
                        state.currentCurveConnections.splice(i, 1)
                    } else if (state.currentCurveConnections[i].secondNodeId === action.payload.nodeId && state.currentCurveConnections[i].secondPortId === action.payload.portId){
                        state.currentCurveConnections.splice(i, 1)
                    }
                }
            }
        }
    },
    extraReducers: (builder) => {
        //ToDo different handling of the three async function
        builder.addCase(getWorkspaceFromBackend.pending, (state, action) => {
            state.statusGet = "loading"
        })
        builder.addCase(getWorkspaceFromBackend.fulfilled, (state, action) => {
            state.currentWS = action.payload.workspace
            state.currentCurveConnections = action.payload.curveConnections
            state.statusGet = "idle"
        })
        builder.addCase(getWorkspaceFromBackend.rejected, (state, action) => {
            state.statusGet = "failed"
        })

        builder.addCase(uploadWorkspaceToBackend.pending, (state, action) => {
            state.statusPost = "loading"
        })
        builder.addCase(uploadWorkspaceToBackend.fulfilled, (state, action) => {
            state.statusPost = "idle"
        })
        builder.addCase(uploadWorkspaceToBackend.rejected, (state, error) => {
            console.error(error)
            state.statusPost = "failed"
        })
    }
})

export const workspacesStateActions = workspacesSlice.actions;