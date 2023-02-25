import React from "react"
import { ControlBar } from "../components/controlbar"
import { WSNodeType } from "../store/index"
import WSNode from "./ws-node"

export const WorkspaceField: React.FC = () => {

    const [fieldCOS, changeFieldCOS] = React.useState<{x: number, y: number}>({x: 0, y:0})
    const [mousePosition, changeMousePosition] = React.useState<{x: number, y: number}>({x:0, y:0})
    const [mousePosBeforeDrag, changeMousePosBeforeDrag] = React.useState<{x: number, y: number}>({x:0, y:0})
    const [fieldCOSBeforeDrag, changeFieldCOSBeforeDrag] = React.useState<{x: number, y: number}>({x:0, y:0})
    const [fieldOnDrag, changeFieldOnDrag] = React.useState<boolean>(false)

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

    const listOfNodes: WSNodeType[] = [
        {id: 0, type: "constant", connections: [], position: {x: 20, y: 30}},
        {id: 1, type: "constant", connections: [], position: {x: 50, y: 70}},
        {id: 2, type: "constant", connections: [], position: {x: 40, y: 100}},
        {id: 3, type: "constant", connections: [], position: {x: 80, y: 30}},
        {id: 4, type: "constant", connections: [], position: {x: 100, y: 70}},
        {id: 5, type: "constant", connections: [], position: {x: 150, y: 100}},
        {id: 6, type: "constant", connections: [], position: {x: 220, y: 30}},
        {id: 7, type: "constant", connections: [], position: {x: 0, y: 70}},
        {id: 8, type: "constant", connections: [], position: {x: 400, y: 100}}
    ]

    function handleMouseDown(e: React.FormEvent) {
        changeFieldOnDrag(true)
        changeMousePosBeforeDrag(mousePosition)
        changeFieldCOSBeforeDrag(fieldCOS)


    }
    function handleMouseUp(e: React.FormEvent) {
        changeFieldOnDrag(false)

    }

    return (
        <section className = "flex-1 ">
            <div
                className = "relative bg-green-200 h-full hover:cursor-grab active:cursor-grabbing"
                onMouseDown = {handleMouseDown}
                onMouseUp = {handleMouseUp}
            >
                <ControlBar/>
                {listOfNodes.map((curNode) => <WSNode WSNodeInput = {curNode} mousePosition = {mousePosition} fieldCOS = {fieldCOS}/>)}
            </div>
        </section>
    )
}