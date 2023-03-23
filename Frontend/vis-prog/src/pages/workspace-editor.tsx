import React from "react"

import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"
import { WorkspaceField } from "../components/workspace-field"
import { addNodesMenuActions } from "../store/add-nodes-menu"
import { useAppDispatch, useAppSelector } from "../store"
import { WorkspaceLoader } from "../components/workspace-loader"
import { workspacesSlice } from "../store/workspaces-subroutines/index-workspaces"
import { getWorkspaceFromBackend, uploadWorkspaceToBackend } from "../store/workspaces-subroutines/workspaces-thunks"
import { useAuth0 } from "@auth0/auth0-react"
import { accessTokenActions } from "../store/access-token"
// import { canvasCur@veActions } from "../store/canvas-curves"

export const WorkspaceEditor: React.FC = () => {
    
    const dispatch = useAppDispatch()

    const [skipFirstEvalForWSUpload, updateSkipFirstEvalForWSUpload] = React.useState<boolean>(true)
    const [mousePosition, changeMousePosition] = React.useState<{x: number, y: number}>({x:0, y:0})
    const getWorkspaceStatus = useAppSelector((state) => state.workspaceStateReducers.statusGet)
    const waitingForWorkfield = getWorkspaceStatus === "loading"
    const curWorkspace = useAppSelector((state) => state.workspaceStateReducers.currentWS)
    const curveConnectionsFromWSState = useAppSelector((state) => state.workspaceStateReducers.currentCurveConnections)
    const curConnections = useAppSelector((state) => state.workspaceStateReducers.currentCurveConnections)
    const [triggerSyncBetweenStates, updateTriggerSyncBetweenStates] = React.useState<boolean>(false)

    const [triggerUpload, changeTriggerUpload] = React.useState<boolean>(false)

    const accessTokenAlreadyRead = useAppSelector((state) => state.accessTokenReducer.tokenRead)
    const { getAccessTokenSilently, isAuthenticated } = useAuth0()
    const accessToken = useAppSelector((state) => state.accessTokenReducer.accessToken)

    React.useEffect(() => {
        if (isAuthenticated) {
            if (skipFirstEvalForWSUpload) {
                updateSkipFirstEvalForWSUpload(false)
            } else {
                console.log("Uploading workspace:")
                if (curConnections) {
                    dispatch(uploadWorkspaceToBackend({authToken: accessToken, curWorkspace: curWorkspace, curveConnections: curConnections }))
                } else {
                    dispatch(uploadWorkspaceToBackend({authToken: accessToken, curWorkspace: curWorkspace, curveConnections: [] }))
                }
            }
        }
        
    }, [triggerUpload])

    React.useEffect(() => {
        if (isAuthenticated && accessToken) {
            console.log("Getting workspace from backend")
            dispatch(getWorkspaceFromBackend({authToken: accessToken}))
        }

        const getAccessToken = async () => {
            if (isAuthenticated && !accessTokenAlreadyRead) {
                console.log("Getting access token silently")
                const accToken = await getAccessTokenSilently()
                console.log("Updating the access token in state")
                console.log(accToken)
                dispatch(accessTokenActions.updateAccessToken(accToken))
                dispatch(getWorkspaceFromBackend({authToken: accToken}))
            }
        }

        getAccessToken()
    }, [])

    // React.useEffect(() => {
    //     console.log("Updating curveConnection state")
    //     console.log(curveConnectionsFromWSState)
    //     if (curveConnectionsFromWSState) {
    //         dispatch(canvasCurveActions.updateFromWorkspaceState(curveConnectionsFromWSState))
    //     }
    // }, [triggerSyncBetweenStates])

    React.useEffect(() => {
        function handleMouseMove(this: Window, e: MouseEvent) {
            changeMousePosition({x: e.clientX, y: e.clientY})
        }
        function handleSyncButtom(this: Window, e: KeyboardEvent) {
            if (e.code === "Space") {
                changeTriggerUpload((cur) => !cur)
            }
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("keyup", handleSyncButtom)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("keyup", handleSyncButtom)
        }
    }, [])

    const handleAddNotesMenuClose = (e: React.FormEvent) => {
        dispatch(addNodesMenuActions.closeMenu())
    }

    return (
        <section className="h-screen flex flex-col overflow-hidden" onMouseDown = {handleAddNotesMenuClose}>
            <Navbar/>
            {(!waitingForWorkfield) && <WorkspaceField mousePosition = {mousePosition}/>}
            {waitingForWorkfield && <WorkspaceLoader/>}
            <Footer/>
        </section>
    )
}