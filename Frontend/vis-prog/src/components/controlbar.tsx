import React from "react"
import { addNodesMenuActions } from "../store/add-nodes-menu"
import { useAppSelector, useAppDispatch } from "../store"

export const ControlBar: React.FC = () => {

    const dispatch = useAppDispatch()
    const isOpen = useAppSelector((state) => state.addNodesMenuReducer.open)
    // const isOpen = true

    function handleMouseDown(e: React.FormEvent) {
        e.preventDefault()
        e.stopPropagation()
        
    }

    function handleMouseUp(e: React.FormEvent) {
        e.preventDefault()
        e.stopPropagation()
    }

    function handleClickOnAddNodes(e: React.FormEvent) {
        e.preventDefault()
        e.stopPropagation()
        if (isOpen) {
            dispatch(addNodesMenuActions.closeMenu())
        } else {
            dispatch(addNodesMenuActions.openMenu())
        }
    }
    
    return (
        <section
            className = "absolute flex flex-row-reverse bg-slate-600 mx-[5vw] w-[90vw] border-[1px] border-gray-500 z-30 text-white hover:cursor-auto shadow-2xl"
            style = {{top: "-16px", left: "0px"}}
            onMouseDown = {handleMouseDown}
            onMouseUp = {handleMouseUp}
        >
            <div
                className = "border-l-[1px] w-1/2 px-1 hover:bg-slate-500 border-gray-500 pb-1"
                onClick = {handleClickOnAddNodes}
            >Add Nodes</div>
            {isOpen && <div className = "absolute grid grid-cols-5 top-full p-1 w-1/2 h-20 border-[1px] border-gray-500 bg-slate-600">
            
                <div className = "w-20 h-20 bg-red-200"></div>
                <div className = "w-20 h-20 bg-red-200"></div>
                <div className = "w-20 h-20 bg-red-200"></div>
                <div className = "w-20 h-20 bg-red-200"></div>
                <div className = "w-20 h-20 bg-red-200"></div>
                <div className = "w-20 h-20 bg-red-200"></div>
                <div className = "w-20 h-20 bg-red-200"></div>
                <div className = "w-20 h-20 bg-red-200"></div>
            </div>}
        </section>
        )
}