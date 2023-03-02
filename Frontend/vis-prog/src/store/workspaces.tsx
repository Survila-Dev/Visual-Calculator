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
    value: number
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
    currentWS: Workspace | null,
    status: "idle" | "loading" | "failed",
}

const initNode1: WSNodeType = {
    id: 0, type: "division", connections: [], position: {x: 50, y: 180}, value: 0
}
const initNode2: WSNodeType = {
    id: 1, type: "fork", connections: [], position: {x: 200, y: 50}, value: 0
}
const initNode3: WSNodeType = {
    id: 2, type: "substraction", connections: [], position: {x: 400, y: 400}, value: 0
}
const initNode4: WSNodeType = {
    id: 3, type: "multiplication", connections: [], position: {x: 300, y: 400}, value: 0
}
const initNode5: WSNodeType = {
    id: 4, type: "division", connections: [], position: {x: 400, y: 300}, value: 0
}
const initNode6: WSNodeType = {
    id: 5, type: "output", connections: [], position: {x: 0, y: 300}, value: 0
}
const initNode7: WSNodeType = {
    id: 6, type: "constant", connections: [], position: {x: 50, y: 130}, value: 0
}

export const initRelativePosition = {x: 50, y: 0}
const initNodeConstant: WSNodeType = {
    id: 1000, type: "constant", connections: [], position: initRelativePosition, value: 0
}
const initNodeOutput: WSNodeType = {
    id: 1001, type: "output", connections: [], position: initRelativePosition, value: 0
}
const initNodeAdd: WSNodeType = {
    id: 1002, type: "addition", connections: [], position: initRelativePosition, value: 0
}
const initNodeSubstract: WSNodeType = {
    id: 1003, type: "substraction", connections: [], position: initRelativePosition, value: 0
}
const initNodeMultiply: WSNodeType = {
    id: 1004, type: "multiplication", connections: [], position: initRelativePosition, value: 0
}
const initNodeDivision: WSNodeType = {
    id: 1004, type: "division", connections: [], position: initRelativePosition, value: 0
}
const initNodeFork: WSNodeType = {
    id: 1005, type: "fork", connections: [], position: initRelativePosition, value: 0
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
            console.log("Found it is " + i as any as string)
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
    "addition": (a: number, b: number): number => a + b,
    "substraction": (a: number, b: number): number => a - b,
    "multiplication": (a: number, b: number): number => a * b,
    "division": ((a: number, b: number): number => {
        if (b !== 0) {
            return a / b
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
        changeVariableAndTriggerRecalc(state) {

            // recursive function to calculate the values
            function calculationPropagation(nodeId: number): number {

                if (state.currentWS) {
                    const actualNodeId = findIdInNodeList(state.currentWS.nodes, nodeId)
                    console.log("current WS found; actual node: ")
                    console.log(actualNodeId)
                    console.log("id to look for " + nodeId)
                    console.log(state.currentWS.nodes)

                    if (actualNodeId !== null) {
                        console.log("Actual node found")
                        // check if all connections there and get actual connections id
                        const nodeType = state.currentWS.nodes[actualNodeId].type
                        let otherFirstNodeForCalc: (number | null) = null
                        let otherSecondNodeForCalc: (number | null) = null
                        if (nodeType === "output" || nodeType === "fork") {
                            // should have connection with selfPort === 0
                            const connection = state.currentWS.nodes[actualNodeId].connections.find((cur) => cur.portSelf === 0)
                            if (connection) {
                                console.log("Connection for output, fork found")
                                otherFirstNodeForCalc = connection.otherNodeId
                            } else {
                                console.error("Either output or fork node does not find connection")
                                //! no connection there show it
                            }
                        } else if (nodeType !== "constant"){
                            const firstConnection = state.currentWS.nodes[actualNodeId].connections.find((cur) => cur.portSelf === 0)
                            const secondConnection = state.currentWS.nodes[actualNodeId].connections.find((cur) => cur.portSelf === 1)
                            if (firstConnection && secondConnection) {
                                console.log("Connection for two input node found")
                                otherFirstNodeForCalc = firstConnection.otherNodeId
                                otherSecondNodeForCalc = secondConnection.otherNodeId
                            } else {
                                console.error("A node with two input ports does not find connection")
                                //! no connection there show it
                            }
                        } 
                        
                        switch (nodeType) {
                            case "constant":
                                console.log("Constant value read")
                                return state.currentWS.nodes[actualNodeId].value
                            case "output":
                                if (otherFirstNodeForCalc !== null) {
                                    console.log("Output calls its connection")
                                    console.log(otherFirstNodeForCalc)
                                    return calculationPropagation(otherFirstNodeForCalc)
                                }
                                break
                            case "fork":
                                if (otherFirstNodeForCalc !== null) {
                                    return calculationPropagation(otherFirstNodeForCalc)
                                }
                                break
                            default:
                                if (otherFirstNodeForCalc !== null && otherSecondNodeForCalc !== null) {
                                    return calculationSubroutines[nodeType](
                                        calculationPropagation(otherFirstNodeForCalc),
                                        calculationPropagation(otherSecondNodeForCalc)
                                    )
                                }
                            
                        }}
                }
                console.error("Recalc went wrong.")
                return -2000
            }

            if (state.currentWS) {
                state.currentWS.triggerCalc = !state.currentWS.triggerCalc

                for (let i = 0; i < state.currentWS.nodes.length; i++) {
                    if (state.currentWS.nodes[i].type === "output") {
                        state.currentWS.nodes[i].value = calculationPropagation(state.currentWS.nodes[i].id)
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

                const newId = maxId + 1
                state.currentWS.nodes.push({
                    id: newId,
                    type: action.payload.inputWSNode.type,
                    connections: [],
                    position: newPosition,
                    value: 0
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
                        otherNodeId: actualSecondNodeId
                    })

                    state.currentWS.nodes[actualSecondNodeId].connections.push({
                        portSelf: action.payload.secondPortId,
                        portOther: action.payload.firstPortId,
                        otherNodeId: actualFirstNodeId
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