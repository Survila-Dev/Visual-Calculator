import { PayloadAction } from "@reduxjs/toolkit"
import { findIdInNodeList } from "./index-workspaces"
import { Workspaces, CalculationSubroutines } from "./types"

const calculationSubroutines: CalculationSubroutines = {
    "addition": (a: number, b: number): number => Number(a) + Number(b),
    "substraction": (a: number, b: number): number => Number(a) - Number(b),
    "multiplication": (a: number, b: number): number => Number(a) * Number(b),
    "division": ((a: number, b: number): number => {
        if (Number(b) !== 0) {
            return Number(a) / Number(b)
        } else {
            throw new Error("Division by zero in calculation.")
        }
        }),
    "fork": (a: number, b: number) => a,
    "constant": (a: number, b: number) => a,
    "output": (a: number, b: number) => a,
}

//! The position of nodes within the array and the node ids are not the same!
//! Because of that the actualNodeId is used and it entails the node index in the array.

export const changeVariableAndTriggerRecalc = (state: Workspaces, action: PayloadAction<{inputNodeId?: number, value?: number}>) => {

    // recursive function to calculate the values
    const calculationPropagation = (nodeId: number): (number | null) => {

        const defaultOutputValue = 0

        if (state.currentWS) {
            const actualNodeId = findIdInNodeList(state.currentWS.nodes, nodeId)

            if (actualNodeId !== null) {

                // check if all connections there and get actual connections id
                const nodeType = state.currentWS.nodes[actualNodeId].type
                let otherFirstNodeForCalc: (number | null) = null
                let otherSecondNodeForCalc: (number | null) = null

                if (nodeType === "output" || nodeType === "fork") {
                    const connection = state.currentWS.nodes[actualNodeId].connections.find((cur) => cur.portSelf === 0)
                    if (connection) {
                        otherFirstNodeForCalc = connection.otherNodeId
                        state.currentWS.nodes[actualNodeId].fullyConnected = true
                    } else {
                        state.currentWS.nodes[actualNodeId].fullyConnected = false
                    }

                } else if (nodeType !== "constant"){
                    const firstConnection = state.currentWS.nodes[actualNodeId].connections.find((cur) => cur.portSelf === 0)
                    const secondConnection = state.currentWS.nodes[actualNodeId].connections.find((cur) => cur.portSelf === 1)
                    if (firstConnection && secondConnection) {
                        otherFirstNodeForCalc = firstConnection.otherNodeId
                        otherSecondNodeForCalc = secondConnection.otherNodeId
                        state.currentWS.nodes[actualNodeId].fullyConnected = true
                    } else {
                        state.currentWS.nodes[actualNodeId].fullyConnected = false
                    }
                } 
                
                switch (nodeType) {
                    case "constant":
                        return state.currentWS.nodes[actualNodeId].value as any as number
                    case "output":
                        if (otherFirstNodeForCalc !== null) {
                            const inputToNode = calculationPropagation(otherFirstNodeForCalc)
                            if (inputToNode !== null) {
                                return calculationPropagation(otherFirstNodeForCalc)
                            } else {
                                state.currentWS.nodes[actualNodeId].fullyConnected = false
                                return null
                            }
                        }
                        break
                    case "fork":
                        if (otherFirstNodeForCalc !== null) {
                            const inputToNode = calculationPropagation(otherFirstNodeForCalc)
                            if (inputToNode !== null) {
                                return calculationPropagation(otherFirstNodeForCalc)
                            } else {
                                state.currentWS.nodes[actualNodeId].fullyConnected = false
                                return null
                            }
                        }
                        break
                    default:
                        if (otherFirstNodeForCalc !== null && otherSecondNodeForCalc !== null) {
                            const inputToNode1 = calculationPropagation(otherFirstNodeForCalc)
                            const inputToNode2 = calculationPropagation(otherSecondNodeForCalc)

                            if (inputToNode1 !== null && inputToNode2 !== null) {
                                return calculationSubroutines[nodeType](inputToNode1, inputToNode2)
                            } else {
                                state.currentWS.nodes[actualNodeId].fullyConnected = false
                                return null
                            }
                        }
                }
            }
        }
        return null
    }

    // update the value
    if (state.currentWS) {
        state.currentWS.triggerCalc = !state.currentWS.triggerCalc

        if (action.payload.inputNodeId !== undefined && action.payload.value !== undefined) {
            const accCurNodeId = findIdInNodeList(state.currentWS.nodes, action.payload.inputNodeId)
            if (accCurNodeId !== null) {
                state.currentWS.nodes[accCurNodeId].value = action.payload.value
            }
        }

        for (let i = 0; i < state.currentWS.nodes.length; i++) {
            if (state.currentWS.nodes[i].type === "output") {
                const nodeOutput = calculationPropagation(state.currentWS.nodes[i].id)
                if (nodeOutput !== null) {
                    state.currentWS.nodes[i].value = nodeOutput
                } else {
                    state.currentWS.nodes[i].value = "..."
                }
            }
        }
    }
}