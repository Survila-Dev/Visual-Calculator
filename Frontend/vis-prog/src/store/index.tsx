import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { mouseConnectSlice } from "./mouse-connect";
import { workspacesSlice } from "./workspaces-subroutines/index-workspaces"
import { mouseCurveTrackSlice } from "./mouse-curve-track";
import { workfieldDragSlice } from "./workfield-drag";
import { addNodesMenuSlice } from "./add-nodes-menu";
import { navbarSizeSlice } from "./navbar-size";
import { accessTokenSlice } from "./access-token";

export interface UserInfo {
    isLoggedIn: boolean,
    userName: string,
}

export const store = configureStore({
    reducer: {
        workspaceStateReducers: workspacesSlice.reducer,
        mouseConnectReducer: mouseConnectSlice.reducer,
        mouseTrackReducer: mouseCurveTrackSlice.reducer,
        workfieldDragReducer: workfieldDragSlice.reducer,
        addNodesMenuReducer: addNodesMenuSlice.reducer,
        navbarSizeReducer: navbarSizeSlice.reducer,
        accessTokenReducer: accessTokenSlice.reducer
    }
})

export type DispatchType = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export const useAppDispatch = useDispatch<DispatchType>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


