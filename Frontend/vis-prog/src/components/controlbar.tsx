import React from "react"
import { addNodesMenuActions } from "../store/add-nodes-menu"
import { useAppSelector, useAppDispatch } from "../store"
import {
    WSNodeAddition, WSNodeDivision, WSNodeMultiplication,
    WSNodeSubtraction, WSNodeConstant, WSNodeOutput, WSNodeFork } from "./ws-node-comp"
import { WSNodeType } from "../store/workspaces" 

interface ControlBarProps {
    mousePosition: {x: number, y: number}
    fieldCOS: {x: number, y: number}
}

export const ControlBar = ({mousePosition, fieldCOS}: ControlBarProps) => {

    const dispatch = useAppDispatch()
    const isOpen = useAppSelector((state) => state.addNodesMenuReducer.open)
    // const isOpen = true

    const wsNodesInDropDown: WSNodeType[] = useAppSelector((state) => {
        if (state.workspaceStateReducers.currentWS) {
            return state.workspaceStateReducers.currentWS.initNodes
        } else {
            return []
        }
    })

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
            {isOpen && <div
                className = "absolute grid grid-cols-fluid gap-2 top-full p-2 w-1/2 border-[1px] border-gray-500 bg-slate-600"
                onClick = {handleMouseDown}>
            
                {wsNodesInDropDown.map((curNode) => {
                    
                        let outputComp = <div>Empty</div>
                        switch (curNode.type) {
                            case "addition":
                                outputComp = <WSNodeAddition
                                    WSNodeInput = {curNode}
                                    key = {curNode.id}
                                    mousePosition = {mousePosition}
                                    fieldCOS = {fieldCOS}
                                    inDropDown = {true}
                                    />
                                break
                            case "substraction":
                                outputComp = <WSNodeSubtraction
                                    WSNodeInput = {curNode}
                                    key = {curNode.id}
                                    mousePosition = {mousePosition}
                                    fieldCOS = {fieldCOS}
                                    inDropDown = {true}
                                    />
                                break
                            case "multiplication":
                                outputComp = <WSNodeMultiplication
                                    WSNodeInput = {curNode}
                                    key = {curNode.id}
                                    mousePosition = {mousePosition}
                                    fieldCOS = {fieldCOS}
                                    inDropDown = {true}
                                    />
                                break
                            case "division":
                                outputComp = <WSNodeDivision
                                    WSNodeInput = {curNode}
                                    key = {curNode.id}
                                    mousePosition = {mousePosition}
                                    fieldCOS = {fieldCOS}
                                    inDropDown = {true}
                                    />
                                break
                            case "constant":
                                outputComp = <WSNodeConstant
                                    WSNodeInput = {curNode}
                                    key = {curNode.id}
                                    mousePosition = {mousePosition}
                                    fieldCOS = {fieldCOS}
                                    inDropDown = {true}
                                    />
                                break
                            case "output":
                                outputComp = <WSNodeOutput
                                    WSNodeInput = {curNode}
                                    key = {curNode.id}
                                    mousePosition = {mousePosition}
                                    fieldCOS = {fieldCOS}
                                    inDropDown = {true}
                                    />
                                break
                            case "fork":
                                outputComp = <WSNodeFork
                                    WSNodeInput = {curNode}
                                    key = {curNode.id}
                                    mousePosition = {mousePosition}
                                    fieldCOS = {fieldCOS}
                                    inDropDown = {true}
                                    />}
                        
                        return (
                        <div className = "relative h-24">
                            {outputComp}
                        </div>
                )})}
                
            </div>}
        </section>
        )
}