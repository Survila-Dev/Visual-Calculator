import React from "react"
import { addNodesMenuActions } from "../store/add-nodes-menu"
import { useAppSelector, useAppDispatch } from "../store"
import {
    WSNodeAddition, WSNodeDivision, WSNodeMultiplication,
    WSNodeSubtraction, WSNodeConstant, WSNodeOutput, WSNodeFork
    } from "./ws-node-comp"
import { WSNodeType } from "../store/workspaces" 

interface ControlBarProps {
    mousePosition: {x: number, y: number}
    fieldCOS: {x: number, y: number}
    clickable: boolean
}

export const ControlBar: React.FC<ControlBarProps> = ({mousePosition, fieldCOS, clickable}) => {

    const dispatch = useAppDispatch()
    const isOpen = useAppSelector((state) => state.addNodesMenuReducer.open)

    const wsNodesInDropDown: WSNodeType[] = useAppSelector((state) => {
        if (state.workspaceStateReducers.currentWS) {
            return state.workspaceStateReducers.currentWS.initNodes
        } else {
            return []
        }
    })

    const handleMouseEventDefault = (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleClickOnAddNodes = (e: React.FormEvent) => {
        handleMouseEventDefault(e)

        if (clickable) {
            if (isOpen) {
                dispatch(addNodesMenuActions.closeMenu())
            } else {
                dispatch(addNodesMenuActions.openMenu())
            }
        }
    }
    
    return (
        <section
            className = "absolute flex flex-row-reverse bg-slate-600 mx-[5vw] w-[90vw] border-[1px] border-gray-500 z-30 text-white hover:cursor-auto shadow-2xl"
            style = {{top: "-16px", left: "0px"}}
            onMouseDown = {handleMouseEventDefault}
            onMouseUp = {handleMouseEventDefault}
        >
            <div
                className = "border-l-[1px] w-1/2 px-1 hover:bg-slate-500 border-gray-500 pb-1"
                onClick = {handleClickOnAddNodes}
            >Add Nodes</div>
            {isOpen && <div
                className = "absolute grid grid-cols-fluid gap-2 top-full p-2 w-1/2 border-[1px] border-gray-500 bg-slate-600"
                onClick = {handleMouseEventDefault}>
            
                {wsNodesInDropDown.map((curNode) => {

                    const nodeProps = {
                        WSNodeInput: curNode,
                        key: curNode.id,
                        mousePosition: mousePosition,
                        fieldCOS: fieldCOS,
                        inDropDown: true}
                    
                    let outputComp = <div>Empty</div>
                    switch (curNode.type) {
                        case "addition":
                            outputComp = <WSNodeAddition {...nodeProps}/>
                            break
                        case "substraction":
                            outputComp = <WSNodeSubtraction {...nodeProps}/>
                            break
                        case "multiplication":
                            outputComp = <WSNodeMultiplication {...nodeProps}/>
                            break
                        case "division":
                            outputComp = <WSNodeDivision {...nodeProps}/>
                            break
                        case "constant":
                            outputComp = <WSNodeConstant {...nodeProps}/>
                            break
                        case "output":
                            outputComp = <WSNodeOutput {...nodeProps} />
                            break
                        case "fork":
                            outputComp = <WSNodeFork {...nodeProps} />
                            }
                        
                        return (
                        <div className = "relative h-24">
                            {outputComp}
                        </div>
                )})}
                
            </div>}
        </section>
        )
}