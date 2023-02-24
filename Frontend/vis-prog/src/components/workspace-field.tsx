import React from "react"
import { ControlBar } from "../components/controlbar"

export const WorkspaceField: React.FC = () => {
    return (
        <section className = "flex-1 bg-green-200">
            <div className = "relative">
                <ControlBar/>
                Workspace here
            </div>
        </section>
    )
}