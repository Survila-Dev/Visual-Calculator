import React from "react"
import { useAppDispatch, useAppSelector } from "../../store/index";
// import { canvasCurveActions } from "../../store/canvas-curves"
import { mouseConnectActions } from "../../store/mouse-connect";
import { mouseCurveTrackActions } from "../../store/mouse-curve-track";
import { workspacesStateActions } from "../../store/workspaces-subroutines/index-workspaces";
import { firstRightPortId } from "./ws-node-comp";
import { Coordinates2D } from "../../store/workspaces-subroutines/types";

interface WSNodePortProps {
    id: number,
    parentNodeId: number,
    positionStyle: {top: string, left: string } | {top: string, right: string},
    parentBeingDragged: boolean,
    mousePosition: Coordinates2D,
}

const nodeIdThresholdForNodesInDropDown = 1000

export const WSNodePort: React.FC<WSNodePortProps> = ({id, parentNodeId, positionStyle, parentBeingDragged, mousePosition}) => {

    const dispatch = useAppDispatch();

    const portRef = React.useRef<HTMLDivElement | null>(null)
    const [isFullyConnected, changeIfFullyConnected] = React.useState<boolean>(false)

    const mouseConnectStatus = useAppSelector((state) => state.mouseConnectReducer)
    const listOfConnections = useAppSelector((state) => state.workspaceStateReducers.currentCurveConnections)
    const workfieldIsDragged = useAppSelector((state) => state.workfieldDragReducer.dragged)

    React.useEffect(() => {
        // Checks and updates the status of connection on every rerender
        let notConnected = true;
        if (listOfConnections) {
            for (let i = 0; i < listOfConnections.length; i++) {
                if (listOfConnections[i].firstNodeId === parentNodeId && listOfConnections[i].firstPortId === id) {
                    notConnected = false
                } else if (listOfConnections[i].secondNodeId === parentNodeId && listOfConnections[i].secondPortId === id) {
                    notConnected = false
                }
            }
        }
        changeIfFullyConnected(!notConnected)
    })

    React.useEffect(() => {
        // Update the port positiong during dragging of the parent
        if ((parentBeingDragged || workfieldIsDragged) && portRef.current) {

            const rect = portRef.current.getBoundingClientRect()
            const newPosInput = {x: (rect.left + rect.right)/2, y: (rect.top + rect.bottom)/2}

            dispatch(workspacesStateActions.updatePosition({
                    nodeId: parentNodeId,
                    portId: id,
                    newPos: newPosInput
                }
            ))
        }
    }, [mousePosition])

    function preventDefaultReaction(e: React.FormEvent) {
        e.preventDefault()
        e.stopPropagation()
    }

    // console.log(useAppSelector((state) => state.workspaceStateReducers.currentCurveConnections))

    function handleClick(e: React.FormEvent) {
        preventDefaultReaction(e)

        if (isFullyConnected) {
            changeIfFullyConnected(false)
            dispatch(workspacesStateActions.deleteConnection({
                nodeId: parentNodeId,
                portId: id
            }))
            dispatch(workspacesStateActions.deletePortConnection({
                nodeId: parentNodeId,
                portId: id
            }))
            dispatch(workspacesStateActions.changeVariableAndTriggerRecalc({}))

        } else {

            if (portRef.current) {
                const rect = portRef.current.getBoundingClientRect()
                const newPosInput = {x: (rect.left + rect.right)/2, y: (rect.top + rect.bottom)/2}

                if (!mouseConnectStatus.firstClicked) {
                    if (parentNodeId < nodeIdThresholdForNodesInDropDown) {
                        dispatch(mouseConnectActions.clickFirst({
                            nodeId: parentNodeId, portId: id, portPosition: newPosInput
                        }))
                        dispatch(mouseCurveTrackActions.startTracking(newPosInput))
                    }
                } else {
                    // create new connection
                    // check if connection not to self and if the right sides are being connected
                    let shouldConnect = true
                    shouldConnect = mouseConnectStatus.firstNodeId !== parentNodeId
                    if (id < firstRightPortId) {
                        if (mouseConnectStatus.firstPortId < firstRightPortId) {
                            shouldConnect = false
                        }
                    } else {
                        if (mouseConnectStatus.firstPortId >= firstRightPortId) {
                            shouldConnect = false
                        }
                    }
                    if (parentNodeId >= nodeIdThresholdForNodesInDropDown) {
                        shouldConnect = false
                    }

                    if (shouldConnect) {
                        dispatch(workspacesStateActions.addNewConnection({
                            firstNodeId: mouseConnectStatus.firstNodeId,
                            firstPortId: mouseConnectStatus.firstPortId,
                            secondNodeId: parentNodeId,
                            secondPortId: id,
                            firstPortPos: mouseConnectStatus.firstPortPosition,
                            secondPortPos: newPosInput}
                        ))
                        dispatch(mouseConnectActions.clickSecond())
                        dispatch(mouseCurveTrackActions.stopTracking())
                        dispatch(workspacesStateActions.addNewPortConnection({
                            firstNodeId: mouseConnectStatus.firstNodeId,
                            firstPortId: mouseConnectStatus.firstPortId,
                            secondNodeId: parentNodeId,
                            secondPortId: id,
                        }))
                        changeIfFullyConnected(true)
                        dispatch(workspacesStateActions.changeVariableAndTriggerRecalc({}))
                        
                    }

                }
            }
        }
    }

    const jsxElementActive: JSX.Element = (
        <div
            id = {id as any as string}
            ref = {portRef}
            className = {"absolute w-3 h-3 border-[1px] rounded-full shadow-2xl bg-gray-800 border-white cursor-pointer hover:bg-white"}
            style = {positionStyle}
            onMouseDown = {handleClick}
            onMouseUp = {preventDefaultReaction}
        >
        </div>
    )
    const jsxElementNotActive: JSX.Element = (
        <div
            id = {id as any as string}
            ref = {portRef}
            className = {"absolute w-3 h-3 border-[1px] rounded-full shadow-2xl border-white cursor-pointer hover:bg-white"}
            style = {positionStyle}
            onMouseDown = {handleClick}
            onMouseUp = {preventDefaultReaction}
        >
        </div>
    )

    return (
        <>
            {isFullyConnected && jsxElementActive}
            {!isFullyConnected && jsxElementNotActive}
        </>
    )
}