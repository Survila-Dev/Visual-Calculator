import { WSNodeType } from "./types"

export const initRelativePosition = {x: 50, y: 0}
export const initNodeConstant: WSNodeType = {
    id: 1000, type: "constant", connections: [], position: initRelativePosition, value: 12, fullyConnected: true
}
export const initNodeOutput: WSNodeType = {
    id: 1001, type: "output", connections: [], position: initRelativePosition, value: "...", fullyConnected: true
}
export const initNodeAdd: WSNodeType = {
    id: 1002, type: "addition", connections: [], position: initRelativePosition, value: 0, fullyConnected: true
}
export const initNodeSubstract: WSNodeType = {
    id: 1003, type: "substraction", connections: [], position: initRelativePosition, value: 0, fullyConnected: true
}
export const initNodeMultiply: WSNodeType = {
    id: 1004, type: "multiplication", connections: [], position: initRelativePosition, value: 0, fullyConnected: true
}
export const initNodeDivision: WSNodeType = {
    id: 1004, type: "division", connections: [], position: initRelativePosition, value: 0, fullyConnected: true
}
export const initNodeFork: WSNodeType = {
    id: 1005, type: "fork", connections: [], position: initRelativePosition, value: 0, fullyConnected: true
}