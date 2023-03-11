import { PayloadAction } from "@reduxjs/toolkit"
import { AsyncStatus, Workspace, Workspaces } from "./types"

export const updateWorkspace = (state: Workspaces, action: PayloadAction<{updatedWorkspace: Workspace}>) => {
    state.currentWS = action.payload.updatedWorkspace
}

export const updateWorkspacesStatusGet = (state: Workspaces, action: PayloadAction<{newStatus: AsyncStatus}>) => {
    state.statusGet = action.payload.newStatus
}

export const updateWorkspacesStatusPost = (state: Workspaces, action: PayloadAction<{newStatus: AsyncStatus}>) => {
    state.statusPost = action.payload.newStatus
}