import React from "react"
import { WSNodeType } from ".././store/workspaces"
import { WSNodePort } from "./ws-node-port"
import { useAppDispatch } from "../store"
import { workspacesStateActions } from ".././store/workspaces"

interface WSNodeProps {
    WSNodeInput: WSNodeType,
    mousePosition: {x: number, y: number},
    fieldCOS: {x: number, y: number}
}

export default function WSNode({WSNodeInput, mousePosition, fieldCOS} : WSNodeProps): JSX.Element {

    const [isBeingDragged, changeBeingDragged] = React.useState<boolean>(false)
    const [curPos, changeCurPos] = React.useState<{x: number, y:number}>(WSNodeInput.position)
    const [posBeforeDrag, changePosBeforeDrag] = React.useState<{x: number, y:number}>(WSNodeInput.position)
    const [mousePosBeforeDrag, changeMousePosBeforeDrag] = React.useState<{x: number, y:number}>({x: 0, y: 0})

    const dispatch = useAppDispatch()

    React.useEffect(() => {
        if (isBeingDragged) {
            changeCurPos({
                x: posBeforeDrag.x + mousePosition.x - mousePosBeforeDrag.x,
                y: posBeforeDrag.y + mousePosition.y - mousePosBeforeDrag.y,
            })
        }
    }, [mousePosition, fieldCOS])

    function transformPositionToStyle(position: {x: number, y: number}) : {top: string, left: string} {
        return {
            top: (position.y - fieldCOS.y) as any as string + "px",
            left: (position.x - fieldCOS.x) as any as string + "px"
        }
    }

    function handleMouseDown(e: React.FormEvent) {
        e.stopPropagation()
        e.preventDefault()

        changeBeingDragged(true)
        changePosBeforeDrag(curPos)
        changeMousePosBeforeDrag(mousePosition)
        
    }

    function handleMouseUp(e: React.FormEvent) {
        e.stopPropagation()
        e.preventDefault()

        changeBeingDragged(false)
        dispatch(workspacesStateActions.updateWSNodePosition({nodeId: WSNodeInput.id, newPosition: curPos}))
    }

    const listOfPorts: {id: number, position: {side: "left" | "right", row: number}}[] = [
        {id: 0, position: {side: "left", row: 0}},
        {id: 1, position: {side: "left", row: 1}},
        {id: 2, position: {side: "left", row: 2}},
        {id: 3, position: {side: "right", row: 0}},
        {id: 4, position: {side: "right", row: 1}},
    ]

    return (
        <article
            id = {WSNodeInput.id as any as string}
            className = "absolute h-20 w-40 rounded-md bg-sky-600 shadow-2xl hover:bg-sky-500 active:bg-sky-400 hover:cursor-grab active:cursor-grabbing"
            style = {transformPositionToStyle(curPos)}
            onMouseDown = {handleMouseDown}
            onMouseUp = {handleMouseUp}
        >
            <div className = "flex flex-col h-full">
                <div className = "flex-none text-xl px-2 pb-1 text-white">Id {WSNodeInput.id}</div>
                <div className = "grow bg-slate-600 rounded-b-md"></div>
            </div>
            
            {listOfPorts.map((curPort) => (
                <WSNodePort
                    id = {curPort.id}
                    parentNodeId = {WSNodeInput.id}
                    position = {curPort.position}
                    parentBeingDragged = {isBeingDragged}
                    mousePosition = {mousePosition}
                    />
                )
            )}
        </article>
    )
}