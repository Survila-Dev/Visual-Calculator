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

export const WorkspaceEditor: React.FC = () => {
    
    const dispatch = useAppDispatch()

    const [skipFirstEvalForWSUpload, updateSkipFirstEvalForWSUpload] = React.useState<boolean>(true)
    const [mousePosition, changeMousePosition] = React.useState<{x: number, y: number}>({x:0, y:0})
    const getWorkspaceStatus = useAppSelector((state) => state.workspaceStateReducers.statusGet)
    const waitingForWorkfield = getWorkspaceStatus === "loading"
    const curWorkspace = useAppSelector((state) => state.workspaceStateReducers.currentWS)
    const curConnections = useAppSelector((state) => state.workspaceStateReducers.currentCurveConnections)

    const [triggerUpload, changeTriggerUpload] = React.useState<boolean>(false)

    const accessTokenAlreadyRead = useAppSelector((state) => state.accessTokenReducer.tokenRead)
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0()
    const accessToken = useAppSelector((state) => state.accessTokenReducer.accessToken)

    // Send data to backend
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
            try {
                if (isAuthenticated && !accessTokenAlreadyRead && user) {
                    const accessToken = await getAccessTokenSilently()

                    dispatch(accessTokenActions.updateAccessToken(accessToken))
                    dispatch(getWorkspaceFromBackend({authToken: accessToken}))
                }
            } catch (e) {
                console.error(e)
            }
            
        }

        getAccessToken()
    }, [])

    React.useEffect(() => {
        function handleMouseMove(this: Window, e: MouseEvent) {
            changeMousePosition({x: e.clientX, y: e.clientY})
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
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