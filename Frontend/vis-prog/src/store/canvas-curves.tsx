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

const initCurveConnections: CurveConnection[] = []

const curveConnectionsSlice = createSlice({
    name: "curveConnections",
    initialState: initCurveConnections,
    reducers: {
        updatePosition(
            state,
            action: PayloadAction<{nodeId: number, portId: number, newPos: {x: number, y:number}}>) {
                // Iterate through whole lits and update where the ids are identical
            
        },
        addNewConnection(
            state,
            action: PayloadAction<{
                firstNodeId: number, firstPortId: number, 
                secondNodeId: number, secondPortId: number,
                fisrtPortPos: {x: number, y:number},
                secondPortPos: {x: number, y:number}}>) {

        },
        deleteConnection(state,
            action: PayloadAction<{
                nodeId: number, firstPortId: number, 
                portPos: {x: number, y:number}}>){

                }
    }
})