import React from "react"
import { WSNodeType } from ".././store/workspaces"
import { WSNodePort } from "./ws-node-port"
import { useAppDispatch } from "../store"
import { workspacesStateActions } from ".././store/workspaces"

interface WSNodeParentProps {
    wrappedComponent: JSX.Element,
}

interface WSNodeChildProps {
    WSNodeInput: WSNodeType,
    mousePosition: {x: number, y: number},
    fieldCOS: {x: number, y: number}
}

type WSNodeChildElement = ({ WSNodeInput, mousePosition, fieldCOS }: WSNodeChildProps) => JSX.Element

export default function WSNode ({wrappedComponent}:WSNodeParentProps): WSNodeChildElement {

    const ChildComponent = ({WSNodeInput, mousePosition, fieldCOS}: WSNodeChildProps): JSX.Element => {

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
                className = "absolute h-20 w-40 bg-gray-800 shadow-2xl border-[1px] border-gray-500 hover:bg-gray-900 hover:cursor-grab active:cursor-grabbing"
                style = {transformPositionToStyle(curPos)}
                onMouseDown = {handleMouseDown}
                onMouseUp = {handleMouseUp}
            >
                <div className = "flex flex-col h-full">
                    <div className = "flex-none text-xl px-2 pb-1 text-white">Id {WSNodeInput.id}</div>
                    <div className = "grow bg-slate-600">
                        {wrappedComponent}
                    </div>
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

    return ChildComponent
}