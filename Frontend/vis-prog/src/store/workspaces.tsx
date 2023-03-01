import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export type TypesOfWSNodes =
    "constant"
    | "addition"
    | "substraction"
    | "multiplication"
    | "division"
    | "output"
    | "fork"

export interface WSNodeType {
    id: number,
    type: TypesOfWSNodes,
    connections: {portSelf: number, portOther: number, otherNodeId: number}[],
    position: {x: number, y: number}
}

export interface Workspace {
    name: string,
    id: number,
    nodes: WSNodeType[],
    initNodes: WSNodeType[],
}

export interface Workspaces {
    workspaces: Workspace[],
    currentWS: Workspace | null,
    status: "idle" | "loading" | "failed",
}

const initNode1: WSNodeType = {
    id: 0, type: "division", connections: [], position: {x: 50, y: 180}
}
const initNode2: WSNodeType = {
    id: 1, type: "fork", connections: [], position: {x: 200, y: 50}
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
const initNode6: WSNodeType = {
    id: 5, type: "output", connections: [], position: {x: 0, y: 300}
}
const initNode7: WSNodeType = {
    id: 6, type: "constant", connections: [], position: {x: 50, y: 130}
}

export const initRelativePosition = {x: 50, y: 0}
const initNodeConstant: WSNodeType = {
    id: 1000, type: "constant", connections: [], position: initRelativePosition
}
const initNodeOutput: WSNodeType = {
    id: 1001, type: "output", connections: [], position: initRelativePosition
}
const initNodeAdd: WSNodeType = {
    id: 1002, type: "addition", connections: [], position: initRelativePosition
}
const initNodeSubstract: WSNodeType = {
    id: 1003, type: "substraction", connections: [], position: initRelativePosition
}
const initNodeMultiply: WSNodeType = {
    id: 1004, type: "multiplication", connections: [], position: initRelativePosition
}
const initNodeDivision: WSNodeType = {
    id: 1004, type: "division", connections: [], position: initRelativePosition
}
const initNodeFork: WSNodeType = {
    id: 1005, type: "fork", connections: [], position: initRelativePosition
}


const initWorkspace: Workspace = {
    name: "First workspace",
    id: 0,
    nodes: [initNode1, initNode2, initNode6, initNode7],
    initNodes: [
        initNodeConstant,
        initNodeOutput,
        initNodeAdd,
        initNodeSubstract,
        initNodeMultiply,
        initNodeDivision,
        initNodeFork
    ]
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

        removeWSNode(state, action: PayloadAction<{curWS: Workspace, nodeToDelete: WSNodeType}>) {
            state.workspaces[action.payload.curWS.id].nodes.splice(
                action.payload.nodeToDelete.id, 1
            )
        },
        addWSNode(state, action: PayloadAction<{
            inputWSNode: WSNodeType,
            fieldCOS: {x: number, y: number},
            dropDownPos: {x: number,y: number}}>) {

            const newPosition = {
                x: action.payload.inputWSNode.position.x,
                y: action.payload.inputWSNode.position.y
            }

            if (state.currentWS) {
                const newId = state.currentWS.nodes.length
                state.currentWS.nodes.push({
                    id: newId,
                    type: action.payload.inputWSNode.type,
                    connections: [],
                    position: newPosition
                })
            }
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