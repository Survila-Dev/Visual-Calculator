import React from "react"



export const ControlBar: React.FC = () => {

    const x = "100px"
    const y = "20px"
    
    return (
        <section className = "absolute flex-none mx-[5vw] w-[90vw] bg-red-100" style = {{top: x, left: y}}>Control bar here.</section>
        )
}