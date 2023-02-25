import React from "react"
import { useAppDispatch, useAppSelector } from "../store/index";
import { canvasCurveActions } from "../store/canvas-curves"
import { mouseConnectActions } from "../store/mouse-connect";

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

    const [connected, changeConnected] = React.useState<boolean>(false)

    React.useEffect(() => {

        if (parentBeingDragged && portRef.current) {
            const rect = portRef.current.getBoundingClientRect()
            const newPosInput = {x: (rect.left + rect.right)/2, y: rect.top}
            dispatch(canvasCurveActions.updatePosition({
                    nodeId: parentNodeId,
                    portId: id,
                    newPos: newPosInput
                }
            ))
        }
    }, [mousePosition])

    function convertPositionToStyle(position : {side: "left" | "right", row: number}) {

        const portLateralOffset = 12
        const portRowOffset = 22
        const portRowStartOffset = 10

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
            console.log("Disconnected")
        } else {
            if (portRef.current) {
                const rect = portRef.current.getBoundingClientRect()
                const newPosInput = {x: (rect.left + rect.right)/2, y: rect.top}

                if (!mouseConnectStatus.firstClicked) {
                    // dispatch to mouse connect status the info of this port
                    dispatch(mouseConnectActions.clickFirst({
                        nodeId: parentNodeId, portId: id, portPosition: newPosInput
                    }))
                    console.log("First selected")
                    changeConnected(true)
                } else {
                    // create new connection
                    console.log("Second selected")
                    dispatch(canvasCurveActions.addNewConnection({
                        firstNodeId: mouseConnectStatus.firstNodeId,
                        firstPortId: mouseConnectStatus.firstPortId,
                        secondNodeId: parentNodeId,
                        secondPortId: id,
                        firstPortPos: mouseConnectStatus.firstPortPosition,
                        secondPortPos: newPosInput}
                    ))
                    // if (mouseConnectStatus.firstNodeId && mouseConnectStatus.firstPortId && mouseConnectStatus.firstPortPosition) {
                        
                    dispatch(mouseConnectActions.clickSecond())
                        
                    changeConnected(true)
                }
                }
            }
            }

    return (
        <div
            id = {id as any as string}
            ref = {portRef}
            className = "absolute w-3 h-3 bg-slate-500 cursor-pointer hover:bg-slate-700"
            style = {convertPositionToStyle(position)}
            onMouseDown = {handleClick}
            onMouseUp = {preventDefaultReaction}
        >
        </div>
    )
}