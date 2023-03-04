import React from "react"

export const PageLoading: React.FC = () => {
    return (
        <div className = "flex bg-gray-700 h-screen w-screen flex-col justify-center items-center gap-5">
            <div className = "h-40 w-40 bg-red-500"></div>
            <div className = "text-xl text-white">Page is loading ...</div>
        </div>
        )
}