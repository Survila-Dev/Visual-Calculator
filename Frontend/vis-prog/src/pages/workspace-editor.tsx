import React from "react"

import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"
import { WorkspaceField } from "../components/workspace-field"
import { addNodesMenuActions } from "../store/add-nodes-menu"
import { useAppDispatch } from "../store"

export const WorkspaceEditor: React.FC = () => {

    const dispatch = useAppDispatch()

    const handleAddNotesMenuClose = (e: React.FormEvent) => {
        dispatch(addNodesMenuActions.closeMenu())
    }

    return (
        <section className="h-screen flex flex-col overflow-hidden" onClick = {handleAddNotesMenuClose}>
            <Navbar/>
            <WorkspaceField/>
            <Footer/>
        </section>
    )
}