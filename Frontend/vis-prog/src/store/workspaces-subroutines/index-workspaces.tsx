import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addNewPortConnection, deletePortConnection } from "./add-delete-port-connection"
import { addWSNode, removeWSNode, updateWSNodePosition } from "./add-remove-update-node"
import { changeVariableAndTriggerRecalc } from "./change-variable-and-trigger-recalc"
import { workspacesInitValues } from "./init-workspace-state"
import { WSNodeType } from "./types"

export const findIdInNodeList = (nodeList: WSNodeType[], idToFind: number) => {
    let foundNode: (number | null) = null
    for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].id === idToFind) {
            foundNode = i
        }
    }
    if (foundNode !== null) {
        return foundNode
    } else {
        return null
    }
}

export const workspacesSlice = createSlice({
    name: "workspaces",
    initialState: workspacesInitValues,
    reducers: {
        changeVariableAndTriggerRecalc,
        addWSNode,
        removeWSNode,
        addNewPortConnection,
        deletePortConnection,
        updateWSNodePosition
    },
    extraReducers: (builder) => {
        //ToDo different handling of the three async function
    }
})

export const workspacesStateActions = workspacesSlice.actions;