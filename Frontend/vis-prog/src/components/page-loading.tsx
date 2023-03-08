import React from "react"
import { ImSpinner2 } from "react-icons/im"

export const PageLoading: React.FC = () => {
    return (
        <div className = "flex bg-gray-700 h-screen w-screen flex-col justify-center items-center gap-5">
            <ImSpinner2 className = "animate-spin" size = {150} color = {"white"}/>
            <div className = "text-xl text-white">Page is loading ...</div>
        </div>
        )
}