import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface IAccessTokenSlice {
    accessToken: string,
    tokenRead: boolean
}

const initValue: IAccessTokenSlice = {accessToken: "", tokenRead: false}

export const accessTokenSlice = createSlice({
    name: "accessTokenSlice",
    initialState: initValue,
    reducers: {
        updateAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload
            state.tokenRead = true
        }
    }
})

export const accessTokenActions = accessTokenSlice.actions