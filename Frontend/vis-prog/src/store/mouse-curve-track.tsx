import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface MouseCurveTrackInterface {
    track: boolean,
    startPoint: {x: number, y: number}
}

const initValue: MouseCurveTrackInterface = {
    track: false,
    startPoint: {x: 0, y: 0}
}

export const mouseCurveTrackSlice = createSlice({
    name: "mouseCurveTrack",
    initialState: initValue,
    reducers: {
        startTracking(state, action: PayloadAction<{x: number, y: number}>) {
            state.track = true
            state.startPoint = action.payload
        },
        stopTracking(state) {
            state.track = false
        }
    }
}
)

export const mouseCurveTrackActions = mouseCurveTrackSlice.actions;