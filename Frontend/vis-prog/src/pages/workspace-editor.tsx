import React from "react"

import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"
import { WorkspaceField } from "../components/workspace-field"
import { addNodesMenuActions } from "../store/add-nodes-menu"
import { useAppDispatch, useAppSelector } from "../store"
import { WorkspaceLoader } from "../components/workspace-loader"
import { workspacesSlice } from "../store/workspaces-subroutines/index-workspaces"
import { getWorkspaceFromBackend } from "../store/workspaces-subroutines/workspaces-thunks"

export const WorkspaceEditor: React.FC = () => {
    
    const dispatch = useAppDispatch()

    const [mousePosition, changeMousePosition] = React.useState<{x: number, y: number}>({x:0, y:0})
    const getWorkspaceStatus = useAppSelector((state) => state.workspaceStateReducers.statusGet)
    const waitingForWorkfield = getWorkspaceStatus === "loading"

    React.useEffect(() => {
        dispatch(getWorkspaceFromBackend())
    }, [])

    React.useEffect(() => {
        function handleMouseMove(this: Window, e: MouseEvent) {
            changeMousePosition({x: e.clientX, y: e.clientY})
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
        }
    })

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