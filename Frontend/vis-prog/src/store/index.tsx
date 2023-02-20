import { configureStore, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from '@reduxjs/toolkit'

const counterSlice = createSlice({
    name: "counter",
    initialState: { counter: 0 },
    reducers: {
        change(state, action: PayloadAction<number>) {
            state.counter = action.payload;
        }
    }
})