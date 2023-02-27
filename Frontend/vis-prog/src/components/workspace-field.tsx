import React from "react"
import { ControlBar } from "../components/controlbar"
import { WSNodeType } from "../store/workspaces"
import WSNode from "./ws-node"
import { BackCanvas } from "./background-canvas"
import { useAppDispatch, useAppSelector } from "../store/index"
import { workfieldDragActions } from "../store/workfield-drag"

const WSNodeHello = WSNode({wrappedComponent: (
    <div>Hello world</div>
)})

export const WorkspaceField: React.FC = () => {

    const [fieldCOS, changeFieldCOS] = React.useState<{x: number, y: number}>({x: 0, y:0})
    const [mousePosition, changeMousePosition] = React.useState<{x: number, y: number}>({x:0, y:0})
    const [mousePosBeforeDrag, changeMousePosBeforeDrag] = React.useState<{x: number, y: number}>({x:0, y:0})
    const [fieldCOSBeforeDrag, changeFieldCOSBeforeDrag] = React.useState<{x: number, y: number}>({x:0, y:0})
    const [fieldOnDrag, changeFieldOnDrag] = React.useState<boolean>(false)

    const workspacesStatus = useAppSelector((state) => state.workspaceStateReducers.workspaces)

    

    const dispatch = useAppDispatch()

    const listOfNodes: WSNodeType[] = useAppSelector((state) => {
        if (state.workspaceStateReducers.currentWS) {
            return state.workspaceStateReducers.currentWS.nodes
        } else {
            return []
        }
    })

    // Create event listener for moving mouce and give this info to children
    React.useEffect(()=>{
        function handleMouseMove(this: Window, e: MouseEvent) {
            changeMousePosition({x: e.clientX, y: e.clientY})
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
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
                <ControlBar/>
                
                {listOfNodes.map((curNode) => <WSNodeHello WSNodeInput = {curNode} mousePosition = {mousePosition} fieldCOS = {fieldCOS}/>)}
                <BackCanvas mousePosition = {mousePosition}/>
            </div>
        </section>
    )
}