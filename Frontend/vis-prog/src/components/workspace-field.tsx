import React from "react"
import { ControlBar } from "../components/controlbar"

export const WorkspaceField: React.FC = () => {
    return (
        <section className = "flex-1 bg-green-200">
            <ControlBar/>
            Workspace here
        </section>
    )
}