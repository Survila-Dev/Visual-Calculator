import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface WorkfieldDragStatusInterface {
    dragged: boolean
}

export const workfieldDragSlice = createSlice({
    name: "workfieldDrag",
    initialState: {dragged: false},
    reducers: {
        isBeingDragged(state) {
            state.dragged = true
        },
        isNotBeingDragged(state) {
            state.dragged = false
        }
    }
})

export const workfieldDragActions = workfieldDragSlice.actions;