import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addNewPortConnection, deletePortConnection } from "./add-delete-port-connection"
import { addWSNode, removeWSNode, updateWSNodePosition } from "./add-remove-update-node"
import { changeVariableAndTriggerRecalc } from "./change-variable-and-trigger-recalc"
import { workspacesInitValues } from "./init-workspace-state"
import { initNodeAdd, initNodeConstant, initNodeDivision, initNodeFork, initNodeMultiply, initNodeOutput, initNodeSubstract } from "./nodes-for-dropdown"

export type TypesOfWSNodes =
    | "constant"
    | "addition"
    | "substraction"
    | "multiplication"
    | "division"
    | "output"
    | "fork"

export type WSNodePortConnectionType = {portSelf: number, portOther: number, otherNodeId: number}

export interface WSNodeType {
    id: number,
    type: TypesOfWSNodes,
    connections: WSNodePortConnectionType[],
    position: {x: number, y: number},
    value: number | string,
    fullyConnected: boolean
}

export interface Workspace {
    name: string,
    id: number,
    nodes: WSNodeType[],
    initNodes: WSNodeType[],
    triggerCalc: boolean
}

export interface Workspaces {
    currentWS: Workspace,
    status: "idle" | "loading" | "failed",
}

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

export const workspacesSlice = createSlice({
    name: "workspaces",
    initialState: workspacesInitValues,
    reducers: {
        changeVariableAndTriggerRecalc,
        addWSNode,
        removeWSNode,
        addNewPortConnection,
        deletePortConnection,
        updateWSNodePosition
    },
    extraReducers: (builder) => {
        //ToDo different handling of the three async function
    }
})

export const workspacesStateActions = workspacesSlice.actions;