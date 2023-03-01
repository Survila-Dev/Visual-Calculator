import React from "react"
import { WSNodeType, initRelativePosition } from "../store/workspaces" 
import { WSNodePort } from "./ws-node-port"
import { useAppDispatch, useAppSelector } from "../store"
import { workspacesStateActions } from ".././store/workspaces"
import { TypesOfWSNodes } from ".././store/workspaces"
import { calculationSliceActions } from "../store/calculation"


type WSNodeChildElement = ({ WSNodeInput, mousePosition, fieldCOS }: WSNodeChildProps) => JSX.Element

interface WSNodeParentProps {
    type: TypesOfWSNodes,
    title: string,
    listOfPorts: {
        id: number,
        position: {side: "left" | "right", row: number},
        jsxInput: JSX.Element
    }[]
}

interface WSNodeChildProps {
    WSNodeInput: WSNodeType,
    mousePosition: {x: number, y: number},
    fieldCOS: {x: number, y: number},
    inDropDown: boolean
}

function convertPositionToStyleForPort(
    portOrDesc: "port" | "description",
    position : {side: "left" | "right", row: number}) {

    const portRowOffset = 20
    const portRowStartOffsetPort = 40
    const portRowStartOffsetDesc = 33

    if (portOrDesc === "port") {
        const portLateralOffset = 18
        const vertOffset = portRowStartOffsetPort + portRowOffset * position.row;

        if (position.side === "left") {
            return ({ top: vertOffset + "px", left: (-portLateralOffset) + "px"})
        } else {
            return ({ top: vertOffset + "px", right: (-portLateralOffset) + "px"})
        }

    } else if (portOrDesc === "description") {
        const portLateralOffset = 0
        const vertOffset = portRowStartOffsetDesc + portRowOffset * position.row;

        if (position.side === "left") {
            return ({ top: vertOffset + "px", left: (portLateralOffset) + "px" })
        } else {
            return ({ top: vertOffset + "px", right: (portLateralOffset) + "px" })
        }
    } else {
        console.error("Wrong position for the port.")
        return { top: "0px", right: "0px" }
    }
}

// HOC to create different types of wsnode elements
export const WSNode = ({type, title, listOfPorts}:WSNodeParentProps): WSNodeChildElement => {

    const ChildComponent = ({WSNodeInput, mousePosition, fieldCOS, inDropDown}: WSNodeChildProps): JSX.Element => {

        const [curPos, changeCurPos] = React.useState<{x: number, y:number}>(WSNodeInput.position)
        const [posBeforeDrag, changePosBeforeDrag] = React.useState<{x: number, y:number}>(WSNodeInput.position)
        const [isBeingDragged, changeBeingDragged] = React.useState<boolean>(false)
        const [mousePosBeforeDrag, changeMousePosBeforeDrag] = React.useState<{x: number, y:number}>({x: 0, y: 0})
        const dispatch = useAppDispatch()

        const [inputField, updateInputField] = React.useState<number>(12)
        const [outputFieldValue, updateOutputFieldValue] = React.useState<number>(0)

        const calculationTrigger = useAppSelector((state) => state.calculationReducer.calculationTrigger)
        const wsNodeValues = useAppSelector((state) => state.calculationReducer.wsNodeValues[WSNodeInput.id])
        const wsNodeInDropDownValue = useAppSelector((state) => state.calculationReducer.defaultOutputText)
        let wsNodeCalcValue: string = ""
        if (!inDropDown) {
            wsNodeCalcValue = wsNodeValues as any as string
        } else {
            wsNodeCalcValue = wsNodeInDropDownValue
        }

        React.useEffect(() => {
            if (isBeingDragged) {
                changeCurPos({
                    x: posBeforeDrag.x + mousePosition.x - mousePosBeforeDrag.x,
                    y: posBeforeDrag.y + mousePosition.y - mousePosBeforeDrag.y,
                })
            }
        }, [mousePosition, fieldCOS])

        // React.useEffect(() => {
        //     if (type === "output") {
                
        //     }
        // }, [calculationTrigger])

        function handleInputFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
            updateInputField(e.currentTarget.value as any as number)

            //ToDo Dispatch change to state
        }

        function transformPositionToStyleForNode(position: {x: number, y: number}) : {top: string, left: string} {
            if (inDropDown) {
                return {
                    top: (position.y) as any as string + "px",
                    left: (position.x) as any as string + "px"
                }
            } else {
            
                return {
                    top: (position.y - fieldCOS.y) as any as string + "px",
                    left: (position.x - fieldCOS.x) as any as string + "px"
                }
            }
        }

        function preventDefaultClick(e: React.FormEvent) {
            e.stopPropagation()
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
            
            //ToDo if in drop down dont update the position and trigger create new node with current position
            if (inDropDown) {
                changeBeingDragged(false)
                changeCurPos(initRelativePosition)

                dispatch(workspacesStateActions.addWSNode({
                    inputWSNode: WSNodeInput
                }))

            } else {
                changeBeingDragged(false)
        
                dispatch(workspacesStateActions.updateWSNodePosition({nodeId: WSNodeInput.id, newPosition: curPos}))
            }
        }

        let elementContent : JSX.Element | null = <div>empty</div>

        if (type !== "output" && type !== "constant") {
            elementContent = (
                <div>
                    {listOfPorts.map((curPort) => (
                        <div 
                            className = "absolute text-white px-1"
                            key = {curPort.id}
                            style = {convertPositionToStyleForPort("description", curPort.position)}
                        >
                            {curPort.jsxInput}
                        </div>
                    ))}
                </div>
            )
        } else if (type === "output") {
            elementContent = (
                <div>
                    {listOfPorts.map((curPort) => (
                        <div 
                            className = "absolute text-white px-1"
                            key = {curPort.id}
                            style = {convertPositionToStyleForPort("description", curPort.position)}
                        >
                            {wsNodeCalcValue}
                        </div>
                    ))}
                </div>
            )

        } else if (type === "constant") {
            elementContent = (
                <div>
                    {listOfPorts.map((curPort) => (
                        <div 
                            className = "absolute text-white px-1 w-1/2"
                            key = {curPort.id}
                            style = {convertPositionToStyleForPort("description", curPort.position)}
                        >
                            <input
                                className = "w-full mt-1 bg-slate-500"
                                type = "text"
                                id = "input"
                                name = "input"
                                value = {inputField}
                                onChange = {handleInputFieldChange}
                                onMouseDown = {preventDefaultClick}
                                 />
                        </div>
                    ))}
                </div>
            )

        }

        return (
            <article
                id = {WSNodeInput.id as any as string}
                className = "absolute h-20 w-[8rem] bg-gray-800 shadow-2xl border-[1px] border-gray-500 hover:bg-gray-900 hover:cursor-grab active:cursor-grabbing"
                style = {transformPositionToStyleForNode(curPos)}
                onMouseDown = {handleMouseDown}
                onMouseUp = {handleMouseUp}
            >
                {listOfPorts.map((curPort) => (
                        <WSNodePort
                            id = {curPort.id}
                            key = {curPort.id}
                            parentNodeId = {WSNodeInput.id}
                            positionStyle = {convertPositionToStyleForPort("port", curPort.position)}
                            parentBeingDragged = {isBeingDragged}
                            mousePosition = {mousePosition}
                        />
                        )
                    )}
                {elementContent}

                <div className = "flex flex-col h-full">
                    <div className = "flex-none text-xl px-2 pb-1 text-white">{title}</div>
                    <div className = "grow bg-slate-600">
                    </div>
                </div>
            </article>
        )
    }

    return ChildComponent
}