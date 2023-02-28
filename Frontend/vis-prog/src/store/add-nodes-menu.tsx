import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface AddNodesMenuStateInterface {
    open: boolean
}


export const addNodesMenuSlice = createSlice({
    name: "addNodesMenuState",
    initialState: {open: false},
    reducers: {
        openMenu(state) {
            state.open = true
        },
        closeMenu(state) {
            state.open = false
        }
    }
})

export const addNodesMenuActions = addNodesMenuSlice.actions