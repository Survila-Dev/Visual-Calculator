import { createAsyncThunk, configureStore, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export interface CounterState {
    counter: number,
    status: "idle" | "loading" | "failed",
}

const initCounterStateValue: CounterState = {
    counter: 0,
    status: "idle",
}

// A mock function to mimic making an async request for data
function fetchCount(amount = 1) {
    return new Promise<{ data: number }>((resolve) =>
      setTimeout(() => resolve({ data: amount }), 2000)
    );
  }

export const changeAsync = createAsyncThunk(
    "counter/asyncCounter",
    async (changeValue: number) => {
        const res = await fetchCount(changeValue)
        return res.data
    }
)

const counterSlice = createSlice({
    name: "counter",
    initialState: initCounterStateValue,
    reducers: {
        change(state, action: PayloadAction<number>) {
            state.counter = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(changeAsync.pending, (state) => {
                state.status = "loading"
            })
            .addCase(changeAsync.fulfilled, (state, action) => {
                state.status = "idle"
                state.counter += action.payload
            })
            .addCase(changeAsync.rejected, (state) => {
                state.status = "failed"
            })
    }
})

export const store = configureStore({
    reducer: {counterRed: counterSlice.reducer}
})

export type DispatchType = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export const useAppDispatch = useDispatch<DispatchType>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const actions = counterSlice.actions;