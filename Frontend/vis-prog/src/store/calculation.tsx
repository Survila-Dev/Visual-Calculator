import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { WSNodeType } from "./workspaces"
import { TypesOfWSNodes } from "./workspaces"

export const calculationSubroutines = {
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
    "fork": (a: number): number => a
}

export interface CalculationStateInterface {
    calculationTrigger: boolean,
    wsNodeValues: {nodeId: number, value: number}[],
    defaultOutputText: string
}

const initState: CalculationStateInterface = {
    calculationTrigger: true,
    wsNodeValues: [
        {nodeId: 0, value: 20},
        {nodeId: 1, value: 21},
        {nodeId: 3, value: 22},
        {nodeId: 4, value: 23},
    ],
    defaultOutputText: "20"
}

export const calculationSlice = createSlice({
    name: "calculationSlice",
    initialState: initState,
    reducers: {
        setConstantValue(state, action: PayloadAction<{nodeId: number}>) {
            state.calculationTrigger = !state.calculationTrigger
        },
        addNewNodeToCalculation(state, action: PayloadAction<{nodeId: number, nodeType: TypesOfWSNodes}>) {
            state.wsNodeValues.push({
                nodeId: action.payload.nodeId,
                value: 0
            })
        }
    }
})

export const calculationSliceActions = calculationSlice.actions