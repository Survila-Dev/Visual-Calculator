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
            className = "absolute bg-slate-600 flex-none mx-[5vw] w-[90vw] border-[1px] border-gray-500 z-30 hover:cursor-auto shadow-2xl"
            style = {{top: "-16px", left: "0px"}}
            onMouseDown = {handleMouseDown}
            onMouseUp = {handleMouseUp}
        >
            Control bar here.
        </section>
        )
}