import { PayloadAction } from "@reduxjs/toolkit"
import { findIdInNodeList } from "./index-workspaces"
import { Workspaces } from "./types"

export const addNewPortConnection = (
    state: Workspaces,
    action: PayloadAction<{
        firstNodeId: number, firstPortId: number,
        secondNodeId: number, secondPortId: number
    }>) => {
    if (state.currentWS) {
        const actualFirstNodeId: (number | null) = findIdInNodeList(state.currentWS.nodes, action.payload.firstNodeId)
        const actualSecondNodeId: (number | null) = findIdInNodeList(state.currentWS.nodes, action.payload.secondNodeId)

        if (actualFirstNodeId !== null && actualSecondNodeId !== null) {
            state.currentWS.nodes[actualFirstNodeId].connections.push({
                portSelf: action.payload.firstPortId,
                portOther: action.payload.secondPortId,
                otherNodeId: action.payload.secondNodeId
            })

            state.currentWS.nodes[actualSecondNodeId].connections.push({
                portSelf: action.payload.secondPortId,
                portOther: action.payload.firstPortId,
                otherNodeId: action.payload.firstNodeId
            })
        }
    }
}

export const deletePortConnection = (state: Workspaces, action: PayloadAction<{nodeId: number, portId: number}>) => {
    // find the other node
    let otherNodeId: number | null = null
    let otherPortId: number | null = null
    const curPortId = action.payload.portId

    if (state.currentWS) {
        const actualCurNodeId: (number | null) = findIdInNodeList(state.currentWS.nodes, action.payload.nodeId)
        if (actualCurNodeId !== null) {
            for (let i = 0; i < state.currentWS.nodes[actualCurNodeId].connections.length; i++) {
                if (state.currentWS.nodes[actualCurNodeId].connections[i].portSelf === curPortId) {
                    otherNodeId = state.currentWS.nodes[actualCurNodeId].connections[i].otherNodeId
                    otherPortId = state.currentWS.nodes[actualCurNodeId].connections[i].portOther
                    state.currentWS.nodes[actualCurNodeId].connections.splice(i, 1)
                }   
            }
        }

        if (otherNodeId !== null && otherPortId !== null) {
            const actualOtherNodeId: (number | null) = findIdInNodeList(state.currentWS.nodes, otherNodeId)
            if (actualOtherNodeId !== null) {
                for (let i = 0; i < state.currentWS.nodes[actualOtherNodeId].connections.length; i++) {
                    if (state.currentWS.nodes[actualOtherNodeId].connections[i].portSelf === otherPortId) {
                        state.currentWS.nodes[actualOtherNodeId].connections.splice(i, 1)
                    }
                }
            }
        }
    }
}