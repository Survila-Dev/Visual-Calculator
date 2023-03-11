import React from "react"
import { ControlBar } from "../components/controlbar"
import { AsyncStatus, Workspace, WSNodeType } from "../store/workspaces-subroutines/types"
import { BackCanvas } from "./background-canvas"
import { useAppDispatch, useAppSelector } from "../store/index"
import { workfieldDragActions } from "../store/workfield-drag"
import { mouseCurveTrackActions } from "../store/mouse-curve-track"
import { mouseConnectActions } from "../store/mouse-connect"
import {
    WSNodeAddition, WSNodeDivision, WSNodeMultiplication,
    WSNodeSubtraction, WSNodeConstant, WSNodeOutput, WSNodeFork } from "./ws-node/ws-node-comp"
import { Spinner } from "./sync-spinner"
import { WSNodeChildProps } from "./ws-node/ws-node"
import { workspacesStateActions } from "../store/workspaces-subroutines/index-workspaces"
import { uploadWorkspaceToBackend } from "../store/workspaces-subroutines/workspaces-thunks"

interface WorkspaceFieldProps {
    mousePosition: {x: number, y: number}
}

export const WorkspaceField: React.FC<WorkspaceFieldProps> = ({mousePosition}) => {

    const dispatch = useAppDispatch()

    const [fieldCOS, changeFieldCOS] = React.useState<{x: number, y: number}>({x: 0, y:0})
    const [mousePosBeforeDrag, changeMousePosBeforeDrag] = React.useState<{x: number, y: number}>({x:0, y:0})
    const [fieldCOSBeforeDrag, changeFieldCOSBeforeDrag] = React.useState<{x: number, y: number}>({x:0, y:0})
    const [fieldOnDrag, changeFieldOnDrag] = React.useState<boolean>(false)
    

    const statusPost: AsyncStatus = useAppSelector((state) => state.workspaceStateReducers.statusPost)
    const curWorkspace: Workspace = useAppSelector((state) => state.workspaceStateReducers.currentWS)
    const listOfNodes: WSNodeType[] = useAppSelector((state) => {
        if (state.workspaceStateReducers.currentWS) {
            return state.workspaceStateReducers.currentWS.nodes
        } else {
            return []
        }
    })

    

    function handleKeyDown(this: Window, e: KeyboardEvent) {
        if (e.code === "Escape") {
            dispatch(mouseCurveTrackActions.stopTracking())
            dispatch(mouseConnectActions.clickSecond())
        }
    }

    React.useEffect(()=>{
        // Add event listener for key escape
        window.addEventListener("keyup", handleKeyDown)
        
        return () => {
            window.removeEventListener("keyup", handleKeyDown)
        }
    }, [])

    React.useEffect(() => {
        // When mouse moves update the field position
        if (fieldOnDrag) {
            changeFieldCOS({
                x: fieldCOSBeforeDrag.x - (mousePosition.x - mousePosBeforeDrag.x),
                y: fieldCOSBeforeDrag.y - (mousePosition.y - mousePosBeforeDrag.y),
            })
        }
    }, [mousePosition])

    function handleMouseDown(e: React.FormEvent) {
        changeFieldOnDrag(true)
        changeMousePosBeforeDrag(mousePosition)
        changeFieldCOSBeforeDrag(fieldCOS)
        dispatch(workfieldDragActions.isBeingDragged())
    }

    function handleMouseUp(e: React.FormEvent) {
        changeFieldOnDrag(false)
        dispatch(workfieldDragActions.isNotBeingDragged())
    }

    return (
        <section className = "grow">
            <div
                className = "relative h-full hover:cursor-grab active:cursor-grabbing min-h-0"
                onMouseDown = {handleMouseDown}
                onMouseUp = {handleMouseUp}
            >
                <ControlBar mousePosition={mousePosition} fieldCOS = {fieldCOS} clickable = {true}/>
                
                {listOfNodes.map((curNode) => {

                    const nodeProps: WSNodeChildProps = {
                        WSNodeInput: curNode,
                        mousePosition: mousePosition,
                        fieldCOS: fieldCOS,
                        inDropDown: false,
                        key: (curNode.id as any) as string
                    }

                    switch (curNode.type) {
                        case "addition":
                            return <WSNodeAddition {...nodeProps}/>
                        case "substraction":
                            return <WSNodeSubtraction  {...nodeProps}/>
                        case "multiplication":
                            return <WSNodeMultiplication {...nodeProps}/>
                        case "division":
                            return <WSNodeDivision {...nodeProps}/>
                        case "constant":
                            return <WSNodeConstant {...nodeProps}/>
                        case "output":
                            return <WSNodeOutput {...nodeProps}/>
                        case "fork":
                            return <WSNodeFork {...nodeProps}/>
                    }
                })}
                <BackCanvas mousePosition = {mousePosition} fieldCOS = {fieldCOS}/>
                <Spinner show = {true} status = {statusPost} />
            </div>
        </section>
    )
}