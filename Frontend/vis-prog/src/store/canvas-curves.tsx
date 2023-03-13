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

const initCurveConnections: CurveConnection[] = [
    // {firstNodeId: 0, firstPortId: 3, secondNodeId: 1, secondPortId: 0, firstPortPosition: {x: 0, y: 0}, secondPortPosition: {x:100, y:400}},
    // {firstNodeId: 0, firstPortId: 4, secondNodeId: 2, secondPortId: 1, firstPortPosition: {x: 0, y: 0}, secondPortPosition: {x:100, y:100}},
]

// export const curveConnectionsSlice = createSlice({
//     name: "curveConnections",
//     initialState: initCurveConnections,
//     reducers: {
        
//     }
// })

// export const canvasCurveActions = curveConnectionsSlice.actions;