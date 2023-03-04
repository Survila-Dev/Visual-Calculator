import React from "react"
import { ControlBar } from "./controlbar"

export function WorkspaceLoader() {
    return (
        <div className = "relative h-full min-h-0 bg-gray-700">
            <ControlBar mousePosition={{x: 0, y: 0}} fieldCOS = {{x: 0, y: 0}} clickable = {false}/>
            <div className = "flex h-full w-full flex-col justify-center items-center gap-5">
                <div className = "h-40 w-40 bg-red-500"></div>
                <div className = "text-xl text-white">Workspace is loading ...</div>
            </div>
        </div>
    )
} 