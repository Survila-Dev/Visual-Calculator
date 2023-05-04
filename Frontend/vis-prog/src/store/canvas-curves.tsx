import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface CurveConnection {
    firstNodeId: number,
    firstPortId: number,
    secondNodeId: number,
    secondPortId: number,
    firstPortPosition: {x: number, y: number},
    secondPortPosition: {x: number, y: number},
    connectionColor?: string
}

export interface CurveConnectionList {
    curves: CurveConnection[]
}