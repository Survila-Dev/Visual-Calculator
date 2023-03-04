import React from "react"

import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"
import { WorkspaceField } from "../components/workspace-field"
import { addNodesMenuActions } from "../store/add-nodes-menu"
import { useAppDispatch } from "../store"

export const WorkspaceEditor: React.FC = () => {

    const [mousePosition, changeMousePosition] = React.useState<{x: number, y: number}>({x:0, y:0})

    React.useEffect(() => {
        function handleMouseMove(this: Window, e: MouseEvent) {
            changeMousePosition({x: e.clientX, y: e.clientY})
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
        }
    })

    const dispatch = useAppDispatch()

    const handleAddNotesMenuClose = (e: React.FormEvent) => {
        dispatch(addNodesMenuActions.closeMenu())
    }

    return (
        <section className="h-screen flex flex-col overflow-hidden" onMouseDown = {handleAddNotesMenuClose}>
            <Navbar/>
            <WorkspaceField mousePosition = {mousePosition}/>
            <Footer/>
        </section>
    )
}