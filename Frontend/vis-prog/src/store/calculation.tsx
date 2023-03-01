import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { WSNodeType } from "./workspaces"

const calculationSubroutines = {
    "add": (a: number, b: number): number => a + b,
    "substract": (a: number, b: number): number => a - b,
    "multiply": (a: number, b: number): number => a * b,
    "divide": ((a: number, b: number): number => {
        if (b !== 0) {
            return a / b
        } else {
            throw "Division by zero in calculation."
        }
        }),
}

export interface CalculationStateInterface {
    calculationTrigger: boolean,
    wsNodeValues: number[],
    defaultOutputText: string
}

const initState: CalculationStateInterface = {
    calculationTrigger: true,
    wsNodeValues: [0, 0, 0, 0, 0, 2016, 203, 204],
    defaultOutputText: "20"
}

export const calculationSlice = createSlice({
    name: "calculationSlice",
    initialState: initState,
    reducers: {
        setConstantValue(state, action: PayloadAction<{nodeId: number}>) {
            state.calculationTrigger = !state.calculationTrigger
        }
    }
})

export const calculationSliceActions = calculationSlice.actions