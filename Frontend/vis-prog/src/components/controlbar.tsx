import React from "react"

export const ControlBar: React.FC = () => {

    function handleMouseDown(e: React.FormEvent) {
        e.preventDefault()
        e.stopPropagation()
    }

    function handleMouseUp(e: React.FormEvent) {
        e.preventDefault()
        e.stopPropagation()
    }
    
    return (
        <section
            className = "absolute flex justify-between bg-slate-600 flex-none mx-[5vw] w-[90vw] border-[1px] border-gray-500 z-30 text-white hover:cursor-auto shadow-2xl"
            style = {{top: "-16px", left: "0px"}}
            onMouseDown = {handleMouseDown}
            onMouseUp = {handleMouseUp}
        >
            <div className = "border-r-[1px] w-1/3 px-1 hover:bg-slate-500 border-gray-500 pb-1">Workspaces</div>
            <div className = "border-l-[1px] w-1/3 px-1 hover:bg-slate-500 border-gray-500 pb-1">Add Nodes</div>
        </section>
        )
}