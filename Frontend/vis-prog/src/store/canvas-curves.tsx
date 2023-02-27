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

export const curveConnectionsSlice = createSlice({
    name: "curveConnections",
    initialState: initCurveConnections,
    reducers: {
        updatePosition(
            state,
            action: PayloadAction<{nodeId: number, portId: number, newPos: {x: number, y:number}}>) {
            
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
                firstPortPos: {x: number, y:number},
                secondPortPos: {x: number, y:number}}>) {

            state.push({
                firstNodeId: action.payload.firstNodeId ,
                firstPortId: action.payload.firstPortId,
                secondNodeId: action.payload.secondNodeId,
                secondPortId: action.payload.secondPortId,
                firstPortPosition: action.payload.firstPortPos,
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