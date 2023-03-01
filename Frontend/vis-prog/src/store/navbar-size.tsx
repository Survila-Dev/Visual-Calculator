import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface NavbarSizeInterface {
    height: number
}

const initValue: NavbarSizeInterface = {
    height: 0
}

export const navbarSizeSlice = createSlice({
    name: "navbarSize",
    initialState: initValue,
    reducers: {
        updateHeight(state, action: PayloadAction<number>) {
            state.height = Number(action.payload)
        }
    }
})

export const navbarSizeActions = navbarSizeSlice.actions