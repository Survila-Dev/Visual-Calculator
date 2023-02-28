import React from "react"
import { ControlBar } from "../components/controlbar"
import { WSNodeType } from "../store/workspaces"
import { BackCanvas } from "./background-canvas"
import { useAppDispatch, useAppSelector } from "../store/index"
import { workfieldDragActions } from "../store/workfield-drag"
import { mouseCurveTrackActions } from "../store/mouse-curve-track"
import { mouseConnectActions } from "../store/mouse-connect"
import {
    WSNodeAddition, WSNodeDivision, WSNodeMultiplication,
    WSNodeSubtraction, WSNodeConstant, WSNodeOutput, WSNodeFork } from "./ws-node-comp"

export const WorkspaceField: React.FC = () => {

    const [fieldCOS, changeFieldCOS] = React.useState<{x: number, y: number}>({x: 0, y:0})
    const [mousePosition, changeMousePosition] = React.useState<{x: number, y: number}>({x:0, y:0})
    const [mousePosBeforeDrag, changeMousePosBeforeDrag] = React.useState<{x: number, y: number}>({x:0, y:0})
    const [fieldCOSBeforeDrag, changeFieldCOSBeforeDrag] = React.useState<{x: number, y: number}>({x:0, y:0})
    const [fieldOnDrag, changeFieldOnDrag] = React.useState<boolean>(false)

    const dispatch = useAppDispatch()

    const workspacesStatus = useAppSelector((state) => state.workspaceStateReducers.workspaces)
    const listOfNodes: WSNodeType[] = useAppSelector((state) => {
        if (state.workspaceStateReducers.currentWS) {
            return state.workspaceStateReducers.currentWS.nodes
        } else {
            return []
        }
    })

    // Create event listener for moving mouce and give this info to children
    React.useEffect(()=>{
        function handleMouseMove(this: Window, e: MouseEvent) {
            changeMousePosition({x: e.clientX, y: e.clientY})
        }
        function handleCurveDragDrop(this: Window, e: KeyboardEvent) {
            if (e.code === "Escape") {
                dispatch(mouseCurveTrackActions.stopTracking())
                dispatch(mouseConnectActions.clickSecond())
            }
        }

        window.addEventListener("keyup", handleCurveDragDrop)
        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("keyup", handleCurveDragDrop)
            window.removeEventListener("mousemove", handleMouseMove)
        }
    },[])

    

    React.useEffect(() => {
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
                <ControlBar/>
                
                {listOfNodes.map((curNode) => {
                    switch (curNode.type) {
                        case "addition":
                            return <WSNodeAddition WSNodeInput = {curNode} key = {curNode.id} mousePosition = {mousePosition} fieldCOS = {fieldCOS}/>
                        case "substraction":
                            return <WSNodeSubtraction WSNodeInput = {curNode} key = {curNode.id} mousePosition = {mousePosition} fieldCOS = {fieldCOS}/>
                        case "multiplication":
                            return <WSNodeMultiplication WSNodeInput = {curNode} key = {curNode.id} mousePosition = {mousePosition} fieldCOS = {fieldCOS}/>
                        case "division":
                            return <WSNodeDivision WSNodeInput = {curNode} key = {curNode.id} mousePosition = {mousePosition} fieldCOS = {fieldCOS}/>
                        case "constant":
                            return <WSNodeConstant WSNodeInput = {curNode} key = {curNode.id} mousePosition = {mousePosition} fieldCOS = {fieldCOS}/>
                        case "output":
                            return <WSNodeOutput WSNodeInput = {curNode} key = {curNode.id} mousePosition = {mousePosition} fieldCOS = {fieldCOS}/>
                        case "fork":
                            return <WSNodeFork WSNodeInput = {curNode} key = {curNode.id} mousePosition = {mousePosition} fieldCOS = {fieldCOS}/>
                    }
                })}
                <BackCanvas mousePosition = {mousePosition} fieldCOS = {fieldCOS}/>
            </div>
        </section>
    )
}