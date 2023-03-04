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
import { Spinner } from "./sync-spinner"

interface WorkspaceFieldProps {
    mousePosition: {x: number, y: number}
}

export const WorkspaceField = ({mousePosition}: WorkspaceFieldProps) => {

    const [fieldCOS, changeFieldCOS] = React.useState<{x: number, y: number}>({x: 0, y:0})
    
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
        
        function handleCurveDragDrop(this: Window, e: KeyboardEvent) {
            if (e.code === "Escape") {
                dispatch(mouseCurveTrackActions.stopTracking())
                dispatch(mouseConnectActions.clickSecond())
            }
        }

        window.addEventListener("keyup", handleCurveDragDrop)
        
        return () => {
            window.removeEventListener("keyup", handleCurveDragDrop)
            
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
                <ControlBar mousePosition={mousePosition} fieldCOS = {fieldCOS}/>
                
                {listOfNodes.map((curNode) => {
                    switch (curNode.type) {
                        case "addition":
                            return <WSNodeAddition
                                WSNodeInput = {curNode}
                                key = {curNode.id}
                                mousePosition = {mousePosition}
                                fieldCOS = {fieldCOS}
                                inDropDown = {false}
                                />
                        case "substraction":
                            return <WSNodeSubtraction
                                WSNodeInput = {curNode}
                                key = {curNode.id}
                                mousePosition = {mousePosition}
                                fieldCOS = {fieldCOS}
                                inDropDown = {false}
                                />
                        case "multiplication":
                            return <WSNodeMultiplication
                                WSNodeInput = {curNode}
                                key = {curNode.id}
                                mousePosition = {mousePosition}
                                fieldCOS = {fieldCOS}
                                inDropDown = {false}
                                />
                        case "division":
                            return <WSNodeDivision
                                WSNodeInput = {curNode}
                                key = {curNode.id}
                                mousePosition = {mousePosition}
                                fieldCOS = {fieldCOS}
                                inDropDown = {false}
                                />
                        case "constant":
                            return <WSNodeConstant
                                WSNodeInput = {curNode}
                                key = {curNode.id}
                                mousePosition = {mousePosition}
                                fieldCOS = {fieldCOS}
                                inDropDown = {false}
                                />
                        case "output":
                            return <WSNodeOutput
                                WSNodeInput = {curNode}
                                key = {curNode.id}
                                mousePosition = {mousePosition}
                                fieldCOS = {fieldCOS}
                                inDropDown = {false}
                                />
                        case "fork":
                            return <WSNodeFork
                                WSNodeInput = {curNode}
                                key = {curNode.id}
                                mousePosition = {mousePosition}
                                fieldCOS = {fieldCOS}
                                inDropDown = {false}
                                />
                    }
                })}
                <BackCanvas mousePosition = {mousePosition} fieldCOS = {fieldCOS}/>
                <Spinner show = {true} status = {"failure"} />
            </div>
        </section>
    )
}