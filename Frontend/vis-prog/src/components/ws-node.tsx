import React from "react"
import { WSNodeType } from ".././store/index"
import { WSNodePort } from "./ws-node-port"

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

    React.useEffect(() => {
        if (isBeingDragged) {
            changeCurPos({
                x: posBeforeDrag.x + mousePosition.x - mousePosBeforeDrag.x,
                y: posBeforeDrag.y + mousePosition.y - mousePosBeforeDrag.y,
            })

            // Dispatch changes to curve
            

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
        // Dispatch changes to state
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
            className = "absolute h-20 w-20 bg-red-400 hover:bg-red-500 active:bg-red-800 hover:cursor-grab active:cursor-grabbing"
            style = {transformPositionToStyle(curPos)}
            onMouseDown = {handleMouseDown}
            onMouseUp = {handleMouseUp}
        >
            Id {WSNodeInput.id}
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