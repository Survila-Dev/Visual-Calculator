import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface MouseConnectInterface {
    firstClicked: boolean,
    firstNodeId: number,
    firstPortId: number,
    firstPortPosition: {x: number, y: number}
}

const initValue: MouseConnectInterface = {
    firstClicked: false,
    firstNodeId: 0,
    firstPortId: 0,
    firstPortPosition: {x: 0, y: 0}
}

export const mouseConnectSlice = createSlice({
    name: "mouseConnectSlice",
    initialState: initValue,
    reducers: {
        clickFirst(state, action: PayloadAction<{nodeId: number, portId: number, portPosition: {x: number, y: number}}>) {
            state.firstClicked = true
            state.firstNodeId = action.payload.nodeId
            state.firstPortId = action.payload.portId
            state.firstPortPosition = action.payload.portPosition
        },
        clickSecond(state) {
            state.firstClicked = false
        }
    }
}
)

export const mouseConnectActions = mouseConnectSlice.actions;