import React from "react"
import { ControlBar } from "./controlbar"
import { ImSpinner2 } from "react-icons/im"

const spinnerSize = 150

export function WorkspaceLoader() {
    return (
        <div className = "relative h-full min-h-0 bg-gray-700">
            <ControlBar mousePosition={{x: 0, y: 0}} fieldCOS = {{x: 0, y: 0}} clickable = {false}/>
            <div className = "flex h-full w-full flex-col justify-center items-center gap-5">
            <ImSpinner2 className = "animate-spin" size = {spinnerSize} color = {"white"}/>
                <div className = "text-xl text-white">Workspace is loading ...</div>
            </div>
        </div>
    )
} 