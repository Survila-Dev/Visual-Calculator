import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface WSNodeType {
    id: number,
    type: "constant" | "addition" | "substraktion" | "multiplication" | "division",
    connections: {portSelf: number, portOther: number, otherNode: WSNodeType}[],
    position: {x: number, y: number}
}

export interface Workspace {
    name: string,
    id: number,
    nodes: WSNodeType[],
}

export interface Workspaces {
    workspaces: Workspace[],
    currentWS: Workspace | null,
    status: "idle" | "loading" | "failed",
}

const initNode1: WSNodeType = {
    id: 0, type: "constant", connections: [], position: {x: 50, y: 130}
}
const initNode2: WSNodeType = {
    id: 1, type: "constant", connections: [], position: {x: 200, y: 50}
}
const initNode3: WSNodeType = {
    id: 2, type: "constant", connections: [], position: {x: 300, y: 300}
}
initNode1.connections[0] = {portSelf: 3, portOther: 0, otherNode: initNode2}
initNode1.connections[1] = {portSelf: 4, portOther: 1, otherNode: initNode3}


const initWorkspace: Workspace = {
    name: "First workspace",
    id: 0,
    nodes: [initNode1, initNode2, initNode3],
}

const workspacesInitValues: Workspaces = {
    workspaces: [initWorkspace],
    currentWS: initWorkspace,
    status: "idle"
}

// thunks:
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

export const workspacesSlice = createSlice({
    name: "workspaces",
    initialState: workspacesInitValues,
    reducers: {
        changeCurWS(state, action: PayloadAction<number>) {
            state.currentWS = state.workspaces[action.payload]
        },

        createNewWS(state, action: PayloadAction<Workspace>) {
            state.workspaces.push(action.payload)
        },

        deleteWS(state, action: PayloadAction<Workspace>) {
            state.workspaces.splice(action.payload.id, 1)
        },

        addNewWSNode(state, action: PayloadAction<{curWS: Workspace, newNode: WSNodeType}>) {
            state.workspaces[action.payload.curWS.id].nodes.push(action.payload.newNode)
        },

        removeWSNode(state, action: PayloadAction<{curWS: Workspace, nodeToDelete: WSNodeType}>) {
            //ToDo Iterate through the connections of node and change the connected nodes too
            state.workspaces[action.payload.curWS.id].nodes.splice(
                action.payload.nodeToDelete.id, 1
            )
        },

        updateConnection(state, action: PayloadAction<{curWS: Workspace, firstNode: WSNodeType, secondNode: WSNodeType}>) {
            state.workspaces[action.payload.curWS.id].nodes[action.payload.firstNode.id] = 
                action.payload.firstNode
            state.workspaces[action.payload.curWS.id].nodes[action.payload.secondNode.id] = 
                action.payload.secondNode
        }
    },
    extraReducers: (builder) => {
        //ToDo different handling of the three async function
    }
})

export const workspacesStateActions = workspacesSlice.actions;