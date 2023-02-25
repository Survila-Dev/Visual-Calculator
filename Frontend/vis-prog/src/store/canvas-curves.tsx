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
    {firstNodeId: 0, firstPortId: 0, secondNodeId: 1, secondPortId: 0, firstPortPosition: {x: 10, y: 10}, secondPortPosition: {x:20, y:20}},
    {firstNodeId: 2, firstPortId: 0, secondNodeId: 3, secondPortId: 0, firstPortPosition: {x: 30, y: 10}, secondPortPosition: {x:30, y:10}}
]

export const curveConnectionsSlice = createSlice({
    name: "curveConnections",
    initialState: initCurveConnections,
    reducers: {
        updatePosition(
            state,
            action: PayloadAction<{nodeId: number, portId: number, newPos: {x: number, y:number}}>) {
            
            // Iterate through whole lits and update where the ids are identical
            for (let i = 0; i < state.length; i++) {
                if (state[i].firstNodeId === action.payload.nodeId && state[i].firstPortId === action.payload.portId) {
                    state[i].firstPortPosition = action.payload.newPos
                } else if (state[i].secondNodeId === action.payload.nodeId && state[i].secondPortId === action.payload.portId){
                    state[i].secondPortPosition = action.payload.newPos
                }
            }
            
        },
        addNewConnection(
            state,
            action: PayloadAction<{
                firstNodeId: number, firstPortId: number, 
                secondNodeId: number, secondPortId: number,
                fisrtPortPos: {x: number, y:number},
                secondPortPos: {x: number, y:number}}>) {

            state.push({
                firstNodeId: action.payload.firstNodeId ,
                firstPortId: action.payload.firstPortId,
                secondNodeId: action.payload.secondNodeId,
                secondPortId: action.payload.secondPortId,
                firstPortPosition: action.payload.fisrtPortPos,
                secondPortPosition: action.payload.secondPortPos
            })

        },
        deleteConnection(
            state,
            action: PayloadAction<{
                nodeId: number, portId: number}>){

            for (let i = state.length-1; i >= 0; i--) {
                if (state[i].firstNodeId === action.payload.nodeId && state[i].firstPortId === action.payload.portId) {
                    state.splice(i, 1)
                } else if (state[i].secondNodeId === action.payload.nodeId && state[i].secondPortId === action.payload.portId){
                    state.splice(i, 1)
                }
            }

        }
    }
})

export const canvasCurveActions = curveConnectionsSlice.actions;