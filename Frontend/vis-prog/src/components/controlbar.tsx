import React from "react"



export const ControlBar: React.FC = () => {

    const marginWidth = "4"
    // let classNameInput: string = "absolute flex-none mx-["+marginWidth+"vw] w-[90vw] bg-red-" + 200;
    const classNameInput: string = 'absolute flex-none mx-['+'10vw'+'] w-[90vw] bg-red-'+'100';
    const classNameInput2: string = 'absolute flex-none mx-[5vw] w-[90vw] bg-red-200';

    const classNameInput3 = classNameInput;
    
    console.log(classNameInput)
    return (
        <section className = "absolute flex-none mx-[5vw] w-[90vw] bg-red-100" style = {{top: "0px", left: "0px"}}>Control bar here.</section>
        )
}