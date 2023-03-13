import React from "react"

import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"
import { WorkspaceField } from "../components/workspace-field"
import { addNodesMenuActions } from "../store/add-nodes-menu"
import { useAppDispatch, useAppSelector } from "../store"
import { WorkspaceLoader } from "../components/workspace-loader"
import { workspacesSlice } from "../store/workspaces-subroutines/index-workspaces"
import { getWorkspaceFromBackend, uploadWorkspaceToBackend } from "../store/workspaces-subroutines/workspaces-thunks"
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

    React.useEffect(() => {
        if (skipFirstEvalForWSUpload) {
            updateSkipFirstEvalForWSUpload(false)
        } else {
            console.log("Uploading workspace:")
            if (curConnections) {
                dispatch(uploadWorkspaceToBackend({curWorkspace: curWorkspace, curveConnections: curConnections }))
            } else {
                dispatch(uploadWorkspaceToBackend({curWorkspace: curWorkspace, curveConnections: [] }))
            }
        }
        
    }, [triggerUpload])

    React.useEffect(() => {
        console.log("Getting workspace from backend")
        dispatch(getWorkspaceFromBackend())
        // console.log("Trigger sync.")
        // updateTriggerSyncBetweenStates((cur) => !cur)
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