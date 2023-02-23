import React from "react"

import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"
import { ControlBar } from "../components/controlbar"
import { WorkspaceField } from "../components/workspace-field"

export const WorkspaceEditor: React.FC = () => {
    return (
        <section>
            <Navbar/>
            <ControlBar/>
            <WorkspaceField/>
            <Footer/>
        </section>
    )
}