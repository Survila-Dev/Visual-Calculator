import { CurveConnection } from "../canvas-curves"

export type Coordinates2D = {x: number, y: number}
export type AsyncStatus = "idle" | "loading" | "failed" | "not logged in"

export type TypesOfWSNodes =
    | "constant"
    | "addition"
    | "substraction"
    | "multiplication"
    | "division"
    | "output"
    | "fork"

export type WSNodePortConnectionType = {
    portSelf: number,
    portOther: number,
    otherNodeId: number
    id?: number,
    nodeId?: number
}

export interface WSNodeType {
    id: number,
    type: TypesOfWSNodes,
    connections: WSNodePortConnectionType[],
    position: Coordinates2D,
    value: number | string,
    fullyConnected: boolean
}

export interface Workspace {
    name: string,
    id: number,
    nodes: WSNodeType[],
    initNodes: WSNodeType[],
    triggerCalc: boolean,
    fieldPosition: Coordinates2D,
}

export interface Workspaces {
    currentWS: Workspace,
    statusGet: AsyncStatus,
    statusPost: AsyncStatus,
    currentCurveConnections: CurveConnection[],
    
}

export type CalculationSubroutines = {
    [key in TypesOfWSNodes]: (a: number, b: number) => number
}