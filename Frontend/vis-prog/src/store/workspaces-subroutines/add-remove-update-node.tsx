import { PayloadAction } from "@reduxjs/toolkit"
import { findIdInNodeList } from "./index-workspaces"
import { Workspace, Workspaces, WSNodeType } from "./types"



export const removeWSNode = (state: Workspaces, action: PayloadAction<{nodeId: number}>) => {
            
    if (state.currentWS) {
        const nodeList = state.currentWS.nodes
        const nodeIdToDelete: (number | null) = findIdInNodeList(state.currentWS.nodes, action.payload.nodeId)
        if (nodeIdToDelete !== null) {
            state.currentWS.nodes.splice(nodeIdToDelete, 1)
        }
    }
}

export const addWSNode = (state: Workspaces, action: PayloadAction<{
    inputWSNode: WSNodeType,
    positionForNode: {x: number, y: number},
    fieldCOS: {x: number, y: number},
    posInDropDownMenu: {x: number,y: number}}>) => {

    const newPosition = {
        x: action.payload.positionForNode.x,
        y: action.payload.positionForNode.y
    }

    if (state.currentWS) {
        let maxId = 0;
        for (let i = 0; i < state.currentWS.nodes.length; i++) {
            if (state.currentWS.nodes[i].id > maxId) {
                maxId = state.currentWS.nodes[i].id
            }
        }

        let fullyConnected = false
        if (action.payload.inputWSNode.type === "constant") fullyConnected = true
        const newId = maxId + 1
        state.currentWS.nodes.push({
            id: newId,
            type: action.payload.inputWSNode.type,
            connections: [],
            position: newPosition,
            value: action.payload.inputWSNode.value,
            fullyConnected: fullyConnected
        })
    }
}

export const updateWSNodePosition = (state: Workspaces, action: PayloadAction<{nodeId: number, newPosition: {x: number, y: number}}>) => {
    if (state.currentWS) {
        const actualNodeId: (number | null) = findIdInNodeList(state.currentWS.nodes, action.payload.nodeId)
        if (actualNodeId !== null) {
            state.currentWS.nodes[actualNodeId].position = action.payload.newPosition
        }
    }
}