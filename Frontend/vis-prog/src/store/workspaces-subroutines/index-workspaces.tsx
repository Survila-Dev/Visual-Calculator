import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { addNewPortConnection, deletePortConnection } from "./add-delete-port-connection"
import { addWSNode, removeWSNode, updateWSNodePosition } from "./add-remove-update-node"
import { changeVariableAndTriggerRecalc } from "./change-variable-and-trigger-recalc"
import { workspacesInitValues } from "./init-workspace-state"
import { WSNodeType } from "./types"
import { updateWorkspace, updateWorkspacesStatusGet, updateWorkspacesStatusPost } from "./update-workspace"
import { getWorkspaceFromBackend, uploadWorkspaceToBackend } from "./workspaces-thunks"

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
        updateWSNodePosition,
        updateWorkspace,
        updateWorkspacesStatusGet,
        updateWorkspacesStatusPost
    },
    extraReducers: (builder) => {
        //ToDo different handling of the three async function
        builder.addCase(getWorkspaceFromBackend.pending, (state, action) => {
            state.statusGet = "loading"
        })
        builder.addCase(getWorkspaceFromBackend.fulfilled, (state, action) => {
            state.currentWS = action.payload
            state.statusGet = "idle"
        })
        builder.addCase(getWorkspaceFromBackend.rejected, (state, action) => {
            state.statusGet = "failed"
        })

        builder.addCase(uploadWorkspaceToBackend.pending, (state, action) => {
            state.statusPost = "loading"
        })
        builder.addCase(uploadWorkspaceToBackend.fulfilled, (state, action) => {
            state.statusPost = "idle"
        })
        builder.addCase(uploadWorkspaceToBackend.rejected, (state, error) => {
            console.error(error)
            state.statusPost = "failed"
        })
    }
})

export const workspacesStateActions = workspacesSlice.actions;