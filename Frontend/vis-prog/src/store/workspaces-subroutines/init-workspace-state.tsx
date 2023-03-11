import { initNodeAdd, initNodeConstant, initNodeDivision, initNodeFork, initNodeMultiply, initNodeOutput, initNodeSubstract } from "./nodes-for-dropdown"
import { Workspace, Workspaces, WSNodeType } from "./types"

export const initNode1: WSNodeType = {
    id: 0, type: "constant", connections: [], position: {x: 50, y: 180}, value: 12, fullyConnected: true
}
export const initNode2: WSNodeType = {
    id: 1, type: "constant", connections: [], position: {x: 200, y: 50}, value: 12, fullyConnected: true
}
export const initNode3: WSNodeType = {
    id: 2, type: "output", connections: [], position: {x: 400, y: 400}, value: 0, fullyConnected: false
}
export const initNode4: WSNodeType = {
    id: 3, type: "multiplication", connections: [], position: {x: 300, y: 400}, value: 0, fullyConnected: false
}

export const dropDownNodes = [
    initNodeConstant,
    initNodeOutput,
    initNodeAdd,
    initNodeSubstract,
    initNodeMultiply,
    initNodeDivision,
    initNodeFork
]

const initWorkspace: Workspace = {
    name: "First workspace",
    id: 0,
    nodes: [],
    initNodes: [],
    triggerCalc: false
}

export const workspacesInitValues: Workspaces = {
    currentWS: initWorkspace,
    statusGet: "idle",
    statusPost: "idle"
}