import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

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
    workspaces: Workspace[],
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
const initNode5: WSNodeType = {
    id: 4, type: "division", connections: [], position: {x: 400, y: 300}, value: 0, fullyConnected: false
}
const initNode6: WSNodeType = {
    id: 5, type: "output", connections: [], position: {x: 0, y: 300}, value: 0, fullyConnected: false
}
const initNode7: WSNodeType = {
    id: 6, type: "constant", connections: [], position: {x: 50, y: 130}, value: 0, fullyConnected: false
}

export const initRelativePosition = {x: 50, y: 0}
const initNodeConstant: WSNodeType = {
    id: 1000, type: "constant", connections: [], position: initRelativePosition, value: 12, fullyConnected: true
}
const initNodeOutput: WSNodeType = {
    id: 1001, type: "output", connections: [], position: initRelativePosition, value: "...", fullyConnected: true
}
const initNodeAdd: WSNodeType = {
    id: 1002, type: "addition", connections: [], position: initRelativePosition, value: 0, fullyConnected: true
}
const initNodeSubstract: WSNodeType = {
    id: 1003, type: "substraction", connections: [], position: initRelativePosition, value: 0, fullyConnected: true
}
const initNodeMultiply: WSNodeType = {
    id: 1004, type: "multiplication", connections: [], position: initRelativePosition, value: 0, fullyConnected: true
}
const initNodeDivision: WSNodeType = {
    id: 1004, type: "division", connections: [], position: initRelativePosition, value: 0, fullyConnected: true
}
const initNodeFork: WSNodeType = {
    id: 1005, type: "fork", connections: [], position: initRelativePosition, value: 0, fullyConnected: true
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

function findIdInNodeList(nodeList: WSNodeType[], idToFind: number) {
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

const calculationSubroutines = {
    "addition": (a: number, b: number): number => Number(a) + Number(b),
    "substraction": (a: number, b: number): number => Number(a) - Number(b),
    "multiplication": (a: number, b: number): number => Number(a) * Number(b),
    "division": ((a: number, b: number): number => {
        if (Number(b) !== 0) {
            return Number(a) / Number(b)
        } else {
            throw "Division by zero in calculation."
        }
        })
}

// "constant"
// | "addition"
// | "substraction"
// | "multiplication"
// | "division"
// | "output"
// | "fork"

export const workspacesSlice = createSlice({
    name: "workspaces",
    initialState: workspacesInitValues,
    reducers: {
        changeVariableAndTriggerRecalc(state, action: PayloadAction<{inputNodeId?: number, value?: number}>) {

            // recursive function to calculate the values
            function calculationPropagation(nodeId: number): (number | null) {

                const defaultOutputValue = 0

                if (state.currentWS) {
                    const actualNodeId = findIdInNodeList(state.currentWS.nodes, nodeId)

                    if (actualNodeId !== null) {
                        // check if all connections there and get actual connections id
                        const nodeType = state.currentWS.nodes[actualNodeId].type
                        let otherFirstNodeForCalc: (number | null) = null
                        let otherSecondNodeForCalc: (number | null) = null
                        if (nodeType === "output" || nodeType === "fork") {
                            // should have connection with selfPort === 0
                            const connection = state.currentWS.nodes[actualNodeId].connections.find((cur) => cur.portSelf === 0)
                            if (connection) {
                                otherFirstNodeForCalc = connection.otherNodeId
                                state.currentWS.nodes[actualNodeId].fullyConnected = true
                            } else {
                                console.error("Either output or fork node does not find connection")
                                //! no connection there show it
                                state.currentWS.nodes[actualNodeId].fullyConnected = false
                            }
                        } else if (nodeType !== "constant"){
                            const firstConnection = state.currentWS.nodes[actualNodeId].connections.find((cur) => cur.portSelf === 0)
                            const secondConnection = state.currentWS.nodes[actualNodeId].connections.find((cur) => cur.portSelf === 1)
                            if (firstConnection && secondConnection) {
                                otherFirstNodeForCalc = firstConnection.otherNodeId
                                otherSecondNodeForCalc = secondConnection.otherNodeId
                                state.currentWS.nodes[actualNodeId].fullyConnected = true
                            } else {
                                console.error("A node with two input ports does not find connection")
                                //! no connection there show it
                                state.currentWS.nodes[actualNodeId].fullyConnected = false
                            }
                        } 
                        
                        switch (nodeType) {
                            case "constant":
                                return state.currentWS.nodes[actualNodeId].value as any as number
                            case "output":
                                if (otherFirstNodeForCalc !== null) {
                                    const inputToNode = calculationPropagation(otherFirstNodeForCalc)
                                    if (inputToNode !== null) {
                                        return calculationPropagation(otherFirstNodeForCalc)
                                    } else {
                                        state.currentWS.nodes[actualNodeId].fullyConnected = false
                                        return null
                                    }
                                }
                                break
                            case "fork":
                                if (otherFirstNodeForCalc !== null) {
                                    const inputToNode = calculationPropagation(otherFirstNodeForCalc)
                                    if (inputToNode !== null) {
                                        return calculationPropagation(otherFirstNodeForCalc)
                                    } else {
                                        state.currentWS.nodes[actualNodeId].fullyConnected = false
                                        return null
                                    }
                                    // return calculationPropagation(otherFirstNodeForCalc)
                                }
                                break
                            default:
                                if (otherFirstNodeForCalc !== null && otherSecondNodeForCalc !== null) {
                                    const inputToNode1 = calculationPropagation(otherFirstNodeForCalc)
                                    const inputToNode2 = calculationPropagation(otherSecondNodeForCalc)

                                    if (inputToNode1 !== null && inputToNode2 !== null) {
                                        return calculationSubroutines[nodeType](inputToNode1, inputToNode2)
                                    } else {
                                        state.currentWS.nodes[actualNodeId].fullyConnected = false
                                        return null
                                    }
                                }
                        }
                    }
                }
                console.error("Recalc went wrong.")
                return null
            }

            // update the value

            if (state.currentWS) {
                state.currentWS.triggerCalc = !state.currentWS.triggerCalc

                if (action.payload.inputNodeId !== undefined && action.payload.value !== undefined) {
                    const accCurNodeId = findIdInNodeList(state.currentWS.nodes, action.payload.inputNodeId)
                    if (accCurNodeId !== null) {
                        state.currentWS.nodes[accCurNodeId].value = action.payload.value
                    }
                }

                for (let i = 0; i < state.currentWS.nodes.length; i++) {
                    if (state.currentWS.nodes[i].type === "output") {
                        const nodeOutput = calculationPropagation(state.currentWS.nodes[i].id)
                        if (nodeOutput !== null) {
                            state.currentWS.nodes[i].value = nodeOutput
                        } else {
                            state.currentWS.nodes[i].value = "..."
                        }
                    }
                }
            }
        },

        changeCurWS(state, action: PayloadAction<number>) {
            state.currentWS = state.workspaces[action.payload]
        },

        createNewWS(state, action: PayloadAction<Workspace>) {
            state.workspaces.push(action.payload)
        },

        deleteWS(state, action: PayloadAction<Workspace>) {
            state.workspaces.splice(action.payload.id, 1)
        },

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

        updateWSNodePosition(state, action: PayloadAction<{nodeId: number, newPosition: {x: number, y: number}}>) {
            if (state.currentWS) {
                const actualNodeId: (number | null) = findIdInNodeList(state.currentWS.nodes, action.payload.nodeId)
                if (actualNodeId !== null) {
                    state.currentWS.nodes[actualNodeId].position = action.payload.newPosition
                    state.workspaces[state.currentWS.id] = state.currentWS
                }
            }
        },

        addNewPortConnection(
            state,
            action: PayloadAction<{
                firstNodeId: number, firstPortId: number,
                secondNodeId: number, secondPortId: number
            }>) {
            if (state.currentWS) {
                const actualFirstNodeId: (number | null) = findIdInNodeList(state.currentWS.nodes, action.payload.firstNodeId)
                const actualSecondNodeId: (number | null) = findIdInNodeList(state.currentWS.nodes, action.payload.secondNodeId)

                if (actualFirstNodeId !== null && actualSecondNodeId !== null) {
                    state.currentWS.nodes[actualFirstNodeId].connections.push({
                        portSelf: action.payload.firstPortId,
                        portOther: action.payload.secondPortId,
                        otherNodeId: action.payload.secondNodeId
                    })

                    state.currentWS.nodes[actualSecondNodeId].connections.push({
                        portSelf: action.payload.secondPortId,
                        portOther: action.payload.firstPortId,
                        otherNodeId: action.payload.firstNodeId
                    })
                    state.workspaces[state.currentWS.id] = state.currentWS
                }
            }
        },

        deletePortConnection(state, action: PayloadAction<{nodeId: number, portId: number}>) {
            // find the other node
            let otherNodeId: number | null = null
            let otherPortId: number | null = null
            const curPortId = action.payload.portId

            if (state.currentWS) {
                const actualCurNodeId: (number | null) = findIdInNodeList(state.currentWS.nodes, action.payload.nodeId)
                if (actualCurNodeId !== null) {
                    for (let i = 0; i < state.currentWS.nodes[actualCurNodeId].connections.length; i++) {
                        if (state.currentWS.nodes[actualCurNodeId].connections[i].portSelf === curPortId) {
                            otherNodeId = state.currentWS.nodes[actualCurNodeId].connections[i].otherNodeId
                            otherPortId = state.currentWS.nodes[actualCurNodeId].connections[i].portOther
                            state.currentWS.nodes[actualCurNodeId].connections.splice(i, 1)
                        }   
                    }
                }

                if (otherNodeId !== null && otherPortId !== null) {
                    const actualOtherNodeId: (number | null) = findIdInNodeList(state.currentWS.nodes, otherNodeId)
                    if (actualOtherNodeId !== null) {
                        for (let i = 0; i < state.currentWS.nodes[actualOtherNodeId].connections.length; i++) {
                            if (state.currentWS.nodes[actualOtherNodeId].connections[i].portSelf === otherPortId) {
                                state.currentWS.nodes[actualOtherNodeId].connections.splice(i, 1)
                            }
                        }
                    }
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