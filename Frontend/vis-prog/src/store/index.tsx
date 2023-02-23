import { createAsyncThunk, configureStore, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export interface UserInfo {
    isLoggedIn: boolean,
    userName: string,
}

export interface WSNode {
    id: number,
    type: "constant" | "addition" | "substraktion" | "multiplication" | "division",
    connections: {portSelf: number, portOther: number, otherNode: WSNode}[],
    postion: {x: number, y: number}
}

export interface Workspace {
    name: string,
    id: number,
    nodes: WSNode[],
}

export interface Workspaces {
    workspaces: Workspace[],
    currentWS: Workspace | null,
    status: "idle" | "loading" | "failed",
}

const workspacesInitValues: Workspaces = {
    workspaces: [],
    currentWS: null,
    status: "idle"
}

// thunks:
export const updateWorkspacesForServer = createAsyncThunk(
    "workspace/workspacesUpdateToServer",
    async (infoForUpdate: {idWS: number, updatedWS: Workspace}, thunkAPI) => {
        // Async logic and return a Promise

        //ToDO Update the server and return if OK
    }
)

export const getWorkspacesForOverview = createAsyncThunk(
    "workspace/getWorkspacesForOverview",
    async () => {
        //ToDo Get back a list of workspaces from server with names, ids and return it
    }
)

export const getSingleWorkspace = createAsyncThunk(
    "workspace/getSingleWorkspace",
    async () => {
        //ToDO Get a Workspace object from server and return it
    }
)

const workspacesSlice = createSlice({
    name: "workspaces",
    initialState: workspacesInitValues,
    reducers: {
        changeCurWS(state, action: PayloadAction<number>) {
            state.currentWS = state.workspaces[action.payload]
        },

        createNewWS(state, action: PayloadAction<Workspace>) {
            state.workspaces.push(action.payload)
        },

        deleteWS(state, action: PayloadAction<Workspace>) {
            state.workspaces.splice(action.payload.id, 1)
        },

        addNewWSNode(state, action: PayloadAction<{curWS: Workspace, newNode: WSNode}>) {
            state.workspaces[action.payload.curWS.id].nodes.push(action.payload.newNode)
        },

        removeWSNode(state, action: PayloadAction<{curWS: Workspace, nodeToDelete: WSNode}>) {
            //ToDo Iterate through the connections of node and change the connected nodes too
            state.workspaces[action.payload.curWS.id].nodes.splice(
                action.payload.nodeToDelete.id, 1
            )
        },

        updateConnection(state, action: PayloadAction<{curWS: Workspace, firstNode: WSNode, secondNode: WSNode}>) {
            state.workspaces[action.payload.curWS.id].nodes[action.payload.firstNode.id] = 
                action.payload.firstNode
            state.workspaces[action.payload.curWS.id].nodes[action.payload.secondNode.id] = 
                action.payload.secondNode
        }
    },
    extraReducers: (builder) => {
        //ToDo different handling of the three async function
    }
})

// A mock function to mimic making an async request for data
// function fetchCount(amount = 1) {
//     return new Promise<{ data: number }>((resolve) =>
//       setTimeout(() => resolve({ data: amount }), 2000)
//     );
//   }

// export const changeAsync = createAsyncThunk(
//     "counter/asyncCounter",
//     async (changeValue: number) => {
//         const res = await fetchCount(changeValue)
//         return res.data
//     }
// )

// const counterSlice = createSlice({
//     name: "counter",
//     initialState: initCounterStateValue,
//     reducers: {
//         change(state, action: PayloadAction<number>) {
//             state.counter = action.payload;
//         }
//     },

//     extraReducers: (builder) => {
//         builder
//             .addCase(changeAsync.pending, (state) => {
//                 state.status = "loading"
//             })
//             .addCase(changeAsync.fulfilled, (state, action) => {
//                 state.status = "idle"
//                 state.counter += action.payload
//             })
//             .addCase(changeAsync.rejected, (state) => {
//                 state.status = "failed"
//             })
//     }
// })

export const store = configureStore({
    reducer: {workspaceStateReducers: workspacesSlice.reducer}
})

export type DispatchType = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export const useAppDispatch = useDispatch<DispatchType>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const workspacesStateActions = workspacesSlice.actions;