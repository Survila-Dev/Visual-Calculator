import React from "react"

import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"
import { WorkspaceField } from "../components/workspace-field"

export const WorkspaceEditor: React.FC = () => {
    return (
        <section className="h-screen flex flex-col overflow-hidden">
            <Navbar/>
            <WorkspaceField/>
            <Footer/>
        </section>
    )
}