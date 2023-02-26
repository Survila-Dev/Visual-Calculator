import React from "react"
import { useAppDispatch, useAppSelector } from "../store/index";
import { canvasCurveActions } from "../store/canvas-curves"
import { mouseConnectActions } from "../store/mouse-connect";
import { mouseCurveTrackActions } from "../store/mouse-curve-track";
import { workspacesStateActions } from "../store/workspaces";

interface WSNodePortProps {
    id: number,
    parentNodeId: number,
    position: {side: "left" | "right", row: number},
    parentBeingDragged: boolean,
    mousePosition: {x: number, y: number},
}

export function WSNodePort({id, parentNodeId, position, parentBeingDragged, mousePosition} :WSNodePortProps): JSX.Element {

    const portRef = React.useRef<HTMLDivElement | null>(null)
    const dispatch = useAppDispatch();
    const mouseConnectStatus = useAppSelector((state) => state.mouseConnectReducer)
    const listOfConnections = useAppSelector((state) => state.canvasStateReducers)
    const workfieldIsDragged = useAppSelector((state) => state.workfieldDragReducer.dragged)

    const [connected, changeConnected] = React.useState<boolean>(false)

    React.useEffect(() => {
        // Check if the port is connected via click on the connected port
        // if (connected) {
        let notConnected = true;
        for (let i = 0; i < listOfConnections.length; i++) {
            if (listOfConnections[i].firstNodeId === parentNodeId && listOfConnections[i].firstPortId === id) {
                notConnected = false
            } else if (listOfConnections[i].secondNodeId === parentNodeId && listOfConnections[i].secondPortId === id) {
                notConnected = false
            }
        }
        if (notConnected) {
            changeConnected(false)
        } else {
            changeConnected(true)
        }
        // }
    })

    React.useEffect(() => {
        // Update the port positiong during dragging of the parent
        if ((parentBeingDragged || workfieldIsDragged) && portRef.current) { // 
            const rect = portRef.current.getBoundingClientRect()
            const newPosInput = {x: (rect.left + rect.right)/2, y: (rect.top + rect.bottom)/2}

            dispatch(canvasCurveActions.updatePosition({
                    nodeId: parentNodeId,
                    portId: id,
                    newPos: newPosInput
                }
            ))
        }
    }, [mousePosition])

    function convertPositionToStyle(position : {side: "left" | "right", row: number}) {
        const portLateralOffset = 18
        const portRowOffset = 20
        const portRowStartOffset = 40
        const vertOffset = portRowStartOffset + portRowOffset * position.row;

        if (position.side === "left") {
            return ({
                top: vertOffset + "px",
                left: (-portLateralOffset) + "px"
            })
        } else {
            return ({
                top: vertOffset + "px",
                right: (-portLateralOffset) + "px"
            })
        }
    }

    function preventDefaultReaction(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleClick(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (connected) {
            changeConnected(false)
            dispatch(canvasCurveActions.deleteConnection({
                nodeId: parentNodeId,
                portId: id
            }))

            //ToDo dispatch to state that a connection was disconnected

            console.log("Disconnected")
        } else {
            changeConnected(true)

            if (portRef.current) {
                const rect = portRef.current.getBoundingClientRect()
                const newPosInput = {x: (rect.left + rect.right)/2, y: (rect.top + rect.bottom)/2}

                if (!mouseConnectStatus.firstClicked) {
                    dispatch(mouseConnectActions.clickFirst({
                        nodeId: parentNodeId, portId: id, portPosition: newPosInput
                    }))
                    dispatch(mouseCurveTrackActions.startTracking(newPosInput))
                    

                } else {
                    // create new connection
                    if (mouseConnectStatus.firstNodeId !== parentNodeId) {
                        console.log("Second selected")
                        dispatch(canvasCurveActions.addNewConnection({
                            firstNodeId: mouseConnectStatus.firstNodeId,
                            firstPortId: mouseConnectStatus.firstPortId,
                            secondNodeId: parentNodeId,
                            secondPortId: id,
                            firstPortPos: mouseConnectStatus.firstPortPosition,
                            secondPortPos: newPosInput}
                        ))
                        
                        dispatch(mouseConnectActions.clickSecond())
                        dispatch(mouseCurveTrackActions.stopTracking())
                        //ToDo dispatch to state that new connection was created

                        dispatch(workspacesStateActions.addNewPortConnection({
                            firstNodeId: mouseConnectStatus.firstNodeId,
                            firstPortId: mouseConnectStatus.firstPortId,
                            secondNodeId: parentNodeId,
                            secondPortId: id,
                        }))
                    }

                }
            }
        }
    }

    const jsxElementActive = (
        <div
            id = {id as any as string}
            ref = {portRef}
            className = {"absolute w-3 h-3 border-[1px] rounded-full shadow-2xl bg-sky-500 border-sky-300 cursor-pointer hover:bg-white"}
            style = {convertPositionToStyle(position)}
            onMouseDown = {handleClick}
            onMouseUp = {preventDefaultReaction}
        >
        </div>
    )
    const jsxElementNotActive = (
        <div
            id = {id as any as string}
            ref = {portRef}
            className = {"absolute w-3 h-3 border-[1px] rounded-full shadow-2xl border-white cursor-pointer hover:bg-white"}
            style = {convertPositionToStyle(position)}
            onMouseDown = {handleClick}
            onMouseUp = {preventDefaultReaction}
        >
        </div>
    )

    return (
        <div>
            {connected && jsxElementActive}
            {!connected && jsxElementNotActive}
        </div>
    )
}