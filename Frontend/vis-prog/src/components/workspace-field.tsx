import React from "react"
import { ControlBar } from "../components/controlbar"
import { WSNodeType } from "../store/index"
import WSNode from "./ws-node"

export const WorkspaceField: React.FC = () => {

    const [mousePosition, changeMousePosition] = React.useState<{x: number, y: number}>({x:0, y:0})

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

    const listOfNodes: WSNodeType[] = [
        {id: 0, type: "constant", connections: [], position: {x: 20, y: 30}},
        {id: 1, type: "constant", connections: [], position: {x: 50, y: 70}},
        {id: 2, type: "constant", connections: [], position: {x: 40, y: 100}}
    ]


    return (
        <section className = "flex-1 bg-green-200">
            <div className = "relative">
                x: {String(mousePosition.x)}
                y: {String(mousePosition.y)}
                <ControlBar/>
                {listOfNodes.map((curNode) => <WSNode WSNodeInput = {curNode} mousePosition = {mousePosition}/>)}
            </div>
        </section>
    )
}