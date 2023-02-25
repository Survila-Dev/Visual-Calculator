import React from "react"
import { WSNodeType } from ".././store/index"

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
            console.log("Render")
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
        // dispatch to state
    }

    return (
        <article
            id = {WSNodeInput.id as any as string}
            className = "absolute h-20 w-20 bg-red-400 hover:bg-red-500 active:bg-red-800 hover:cursor-grab active:cursor-grabbing"
            style = {transformPositionToStyle(curPos)}
            onMouseDown = {handleMouseDown}
            onMouseUp = {handleMouseUp}
        >
            Id {WSNodeInput.id}
        </article>
    )
}