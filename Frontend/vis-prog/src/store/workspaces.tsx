import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface WSNodeType {
    id: number,
    type: "constant" | "addition" | "substraction" | "multiplication" | "division" | "output",
    connections: {portSelf: number, portOther: number, otherNodeId: number}[],
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
    id: 0, type: "division", connections: [], position: {x: 50, y: 130}
}
const initNode2: WSNodeType = {
    id: 1, type: "addition", connections: [], position: {x: 200, y: 50}
}
const initNode3: WSNodeType = {
    id: 2, type: "substraction", connections: [], position: {x: 400, y: 400}
}
const initNode4: WSNodeType = {
    id: 3, type: "multiplication", connections: [], position: {x: 300, y: 400}
}
const initNode5: WSNodeType = {
    id: 4, type: "division", connections: [], position: {x: 400, y: 300}
}


const initWorkspace: Workspace = {
    name: "First workspace",
    id: 0,
    nodes: [initNode1, initNode2, initNode3, initNode4, initNode5],
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
            state.workspaces[action.payload.curWS.id].nodes.splice(
                action.payload.nodeToDelete.id, 1
            )
        },
        updateWSNodePosition(state, action: PayloadAction<{nodeId: number, newPosition: {x: number, y: number}}>) {
            if (state.currentWS) {
                state.currentWS.nodes[action.payload.nodeId].position = action.payload.newPosition
                state.workspaces[state.currentWS.id] = state.currentWS
            }
        },
        addNewPortConnection(
            state,
            action: PayloadAction<{
                firstNodeId: number, firstPortId: number,
                secondNodeId: number, secondPortId: number
            }>) {

            if (state.currentWS) {

                state.currentWS.nodes[action.payload.firstNodeId].connections.push({
                    portSelf: action.payload.firstPortId,
                    portOther: action.payload.secondPortId,
                    otherNodeId: action.payload.secondNodeId
                })

                state.currentWS.nodes[action.payload.secondNodeId].connections.push({
                    portSelf: action.payload.secondPortId,
                    portOther: action.payload.firstPortId,
                    otherNodeId: action.payload.firstNodeId
                })
                state.workspaces[state.currentWS.id] = state.currentWS
            }

        },
        deletePortConnection(state, action: PayloadAction<{nodeId: number, portId: number}>) {
            // find the other node
            let otherNodeId: number | null = null
            let otherPortId: number | null = null
            const curNodeId = action.payload.nodeId
            const curPortId = action.payload.portId
            if (state.currentWS) {
                for (let i = 0; i < state.currentWS.nodes[curNodeId].connections.length; i++) {
                    if (state.currentWS.nodes[curNodeId].connections[i].portSelf === curPortId) {
                        otherNodeId = state.currentWS.nodes[curNodeId].connections[i].otherNodeId
                        otherPortId = state.currentWS.nodes[curNodeId].connections[i].portOther
                        state.currentWS.nodes[curNodeId].connections.splice(i, 1)
                    }   
                }
                if (otherNodeId !== null && otherPortId !== null) {
                    for (let i = 0; i < state.currentWS.nodes[otherNodeId].connections.length; i++) {
                        if (state.currentWS.nodes[otherNodeId].connections[i].portSelf === otherPortId) {
                            state.currentWS.nodes[otherNodeId].connections.splice(i, 1)
                        }
                    }
                } else {
                    console.error("Pair not found!")
                }
                state.workspaces[state.currentWS.id] = state.currentWS
            }
            
        }


    },
    extraReducers: (builder) => {
        //ToDo different handling of the three async function
    }
})

export const workspacesStateActions = workspacesSlice.actions;