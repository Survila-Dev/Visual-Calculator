import React from "react"
import { Coordinates2D, WSNodeType } from "../../store/workspaces-subroutines/types" 
import { WSNodePort } from "./ws-node-port"
import { useAppDispatch, useAppSelector } from "../../store"
import { workspacesStateActions } from "../../store/workspaces-subroutines/index-workspaces"
import { TypesOfWSNodes } from "../../store/workspaces-subroutines/types"
// import { canvasCurveActions } from "../../store/canvas-curves"
import { TitleWithIcon } from "../text-with-icon"

import { RxCross2 } from "react-icons/rx"
import { initRelativePosition } from "../../store/workspaces-subroutines/nodes-for-dropdown"

export interface WSNodeChildProps {
    WSNodeInput: WSNodeType,
    mousePosition: {x: number, y: number},
    // fieldCOS: {x: number, y: number},
    inDropDown: boolean,
    key?: string
}

type WSNodeChildElement = React.FC<WSNodeChildProps>
type IPortPosition = {side: "left" | "right", row: number}

interface WSNodeParentProps {
    type: TypesOfWSNodes,
    title: string,
    listOfPorts: {
        id: number,
        position: IPortPosition,
        jsxInput: JSX.Element
    }[]
}

const convertPositionToStyleForPort = (
    portOrDesc: "port" | "description",
    position : IPortPosition) => {

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
export const WSNode = ({type, title, listOfPorts}: WSNodeParentProps): WSNodeChildElement => {

    const ChildComponent: WSNodeChildElement = ({WSNodeInput, mousePosition, inDropDown}) => {

        const dispatch = useAppDispatch()

        const fieldCOS: Coordinates2D = useAppSelector((state) => state.workspaceStateReducers.currentWS.fieldPosition)
        
        const [curPos, changeCurPos] = React.useState<{x: number, y:number}>(WSNodeInput.position)
        const [posBeforeDrag, changePosBeforeDrag] = React.useState<{x: number, y:number}>(WSNodeInput.position)
        const [isBeingDragged, changeBeingDragged] = React.useState<boolean>(false)
        const [mousePosBeforeDrag, changeMousePosBeforeDrag] = React.useState<{x: number, y:number}>({x: 0, y: 0})
        const [inputField, updateInputField] = React.useState<number>(12)

        const refNode = React.useRef<HTMLElement>(null)

        const navbarHeight = useAppSelector((state) => state.navbarSizeReducer.height)
        const wsNodeValues = useAppSelector((state) => {
            try {
                let actualId: (number | null) = null
                for (let i = 0; i < state.workspaceStateReducers.currentWS.nodes.length; i++) {
                    if (state.workspaceStateReducers.currentWS.nodes[i].id === WSNodeInput.id) {
                        actualId = i
                    }
                }
                if (actualId !== null) {
                    return state.workspaceStateReducers.currentWS.nodes[actualId].value
                }
            } catch (e) {
                console.error(e)
                return 0
            }
        })

        const wsNodeInDropDownValue = "..."

        let wsNodeCalcValue: string
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
            updateInputField(wsNodeCalcValue as any as number)
        }, [mousePosition, fieldCOS])

        const handleInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            updateInputField(e.currentTarget.value as any as number)
            dispatch(workspacesStateActions.changeVariableAndTriggerRecalc({inputNodeId: WSNodeInput.id, value: e.currentTarget.value as any as number}))
        }

        const transformPositionToStyleForNode = (position: {x: number, y: number}) : {top: string, left: string} => {
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

        const preventDefaultClick = (e: React.FormEvent) => {
            e.stopPropagation()
        }

        const handleMouseDown = (e: React.FormEvent) => {
            e.stopPropagation()
            e.preventDefault()

            changeBeingDragged(true)
            changePosBeforeDrag(curPos)
            changeMousePosBeforeDrag(mousePosition) 
        }

        const handleMouseUp = (e: React.FormEvent) => {
            e.stopPropagation()
            e.preventDefault()
            
            if (inDropDown) {
                changeBeingDragged(false)
                changeCurPos(initRelativePosition)

                let newPosition: {x: number, y: number} = {x: 0, y: 0}
                if (refNode.current) {
                    newPosition = {
                        x: Number(refNode.current.getBoundingClientRect().left) + fieldCOS.x, 
                        y: Number(refNode.current.getBoundingClientRect().top) + fieldCOS.y - navbarHeight
                    }
                }

                dispatch(workspacesStateActions.addWSNode({
                    inputWSNode: WSNodeInput,
                    positionForNode: newPosition,
                    fieldCOS: fieldCOS,
                    posInDropDownMenu: posBeforeDrag
                }))

            } else {
                changeBeingDragged(false)
                dispatch(workspacesStateActions.updateWSNodePosition({nodeId: WSNodeInput.id, newPosition: curPos}))
            }
        }

        function handleClickDelete(e: React.FormEvent) {
            e.stopPropagation()
            e.preventDefault()

            for (let i = 0; i < 4; i++) {
                dispatch(workspacesStateActions.deleteConnection({nodeId: WSNodeInput.id, portId: i}))
                dispatch(workspacesStateActions.deletePortConnection({nodeId: WSNodeInput.id, portId: i}))
            }
            
            dispatch(workspacesStateActions.removeWSNode({nodeId: WSNodeInput.id}))
            dispatch(workspacesStateActions.changeVariableAndTriggerRecalc({}))
        }

        let elementContent : JSX.Element = <div>empty</div>

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

        const allConnected = WSNodeInput.fullyConnected
        let backPanelJSX = <div></div>

        if (allConnected) {
            backPanelJSX = (
                <div className = "flex flex-col h-full">
                    <div className = "flex flex-row justify-between bg-slate-800 w-full flex-none text-xl text-white">
                        <div className = "flex flex-row w-full justify-between pl-2">
                            <TitleWithIcon title = {title}/>
                            <div
                                onMouseDown = {handleClickDelete}
                                className = "cursor-default h-full w-[30px] flex justify-center items-center hover:bg-red-500"
                            >
                                <RxCross2 size = {25} color = {"white"}/>
                            </div>
                        </div>
                    </div>
                    <div className = "grow bg-slate-600">
                    </div>
                </div>
            )
        } else {
            backPanelJSX = (
                <div className = "flex flex-col h-full">
                    <div className = "flex flex-row justify-between bg-red-500 w-full flex-none text-xl text-white">
                        <div className = "flex flex-row w-full justify-between pl-2">
                            <TitleWithIcon title = {title}/>
                            <div
                                onMouseDown = {handleClickDelete}
                                className = "cursor-default h-full w-[30px] flex justify-center items-center hover:bg-red-700"
                            >
                                <RxCross2 size = {25} color = {"white"}/>
                            </div>
                        </div>
                    </div>
                    <div className = "grow bg-slate-600">
                    </div>
                </div> )
        }


        return (
            <article
                id = {WSNodeInput.id as any as string}
                className = "absolute h-20 w-[9rem] bg-gray-800 shadow-2xl border-[1px] border-gray-500 hover:bg-gray-900 hover:cursor-grab active:cursor-grabbing"
                style = {transformPositionToStyleForNode(curPos)}
                onMouseDown = {handleMouseDown}
                onMouseUp = {handleMouseUp}
                ref = {refNode}
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
                {backPanelJSX}
            </article>
        )
    }

    return ChildComponent
}