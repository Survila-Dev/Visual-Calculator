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
            className = "absolute flex-none mx-[5vw] w-[90vw] bg-slate-500 z-10 hover:cursor-auto shadow-2xl"
            style = {{top: "0px", left: "0px"}}
            onMouseDown = {handleMouseDown}
            onMouseUp = {handleMouseUp}
        >
            Control bar here.
        </section>
        )
}