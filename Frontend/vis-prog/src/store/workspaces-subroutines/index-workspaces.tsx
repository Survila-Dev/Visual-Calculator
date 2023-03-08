import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addNewPortConnection, deletePortConnection } from "./add-delete-port-connection"
import { changeVariableAndTriggerRecalc } from "./change-variable-and-trigger-recalc"
import { initNodeAdd, initNodeConstant, initNodeDivision, initNodeFork, initNodeMultiply, initNodeOutput, initNodeSubstract } from "./initial-nodes"

export type TypesOfWSNodes =
    "constant"
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

const initNode1: WSNodeType = {
    id: 0, type: "constant", connections: [], position: {x: 50, y: 180}, value: 12, fullyConnected: true
}
const initNode2: WSNodeType = {
    id: 1, type: "constant", connections: [], position: {x: 200, y: 50}, value: 12, fullyConnected: true
}
const initNode3: WSNodeType = {
    id: 2, type: "output", connections: [], position: {x: 400, y: 400}, value: 0, fullyConnected: false
}
const initNode4: WSNodeType = {
    id: 3, type: "multiplication", connections: [], position: {x: 300, y: 400}, value: 0, fullyConnected: false
}

const initWorkspace: Workspace = {
    name: "First workspace",
    id: 0,
    nodes: [initNode1, initNode2, initNode3, initNode4],
    initNodes: [
        initNodeConstant,
        initNodeOutput,
        initNodeAdd,
        initNodeSubstract,
        initNodeMultiply,
        initNodeDivision,
        initNodeFork
    ],
    triggerCalc: false
}

const workspacesInitValues: Workspaces = {
    currentWS: initWorkspace,
    status: "idle"
}

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

export const getSingleWorkspace = createAsyncThunk(
    "workspace/getSingleWorkspace",
    async () => {
        //ToDO Get a Workspace object from server and return it
    }
)

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

        removeWSNode(state, action: PayloadAction<{nodeId: number}>) {
            
            if (state.currentWS) {
                const nodeList = state.currentWS.nodes
                const nodeIdToDelete: (number | null) = findIdInNodeList(state.currentWS.nodes, action.payload.nodeId)
                if (nodeIdToDelete !== null) {
                    state.currentWS.nodes.splice(nodeIdToDelete, 1)
                }
            }
        },

        addWSNode(state, action: PayloadAction<{
            inputWSNode: WSNodeType,
            positionForNode: {x: number, y: number},
            fieldCOS: {x: number, y: number},
            posInDropDownMenu: {x: number,y: number}}>) {

            const newPosition = {
                x: action.payload.positionForNode.x,
                y: action.payload.positionForNode.y
            }

            if (state.currentWS) {
                let maxId = 0;
                for (let i = 0; i < state.currentWS.nodes.length; i++) {
                    if (state.currentWS.nodes[i].id > maxId) {
                        maxId = state.currentWS.nodes[i].id
                    }
                }

                let fullyConnected = false
                if (action.payload.inputWSNode.type === "constant") fullyConnected = true
                const newId = maxId + 1
                state.currentWS.nodes.push({
                    id: newId,
                    type: action.payload.inputWSNode.type,
                    connections: [],
                    position: newPosition,
                    value: action.payload.inputWSNode.value,
                    fullyConnected: fullyConnected
                })
            }
        },

        addNewPortConnection,
        deletePortConnection,

        updateWSNodePosition(state, action: PayloadAction<{nodeId: number, newPosition: {x: number, y: number}}>) {
            if (state.currentWS) {
                const actualNodeId: (number | null) = findIdInNodeList(state.currentWS.nodes, action.payload.nodeId)
                if (actualNodeId !== null) {
                    state.currentWS.nodes[actualNodeId].position = action.payload.newPosition
                }
            }
        },

    },
    extraReducers: (builder) => {
        //ToDo different handling of the three async function
    }
})

export const workspacesStateActions = workspacesSlice.actions;