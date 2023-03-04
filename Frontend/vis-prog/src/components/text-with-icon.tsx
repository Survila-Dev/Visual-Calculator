import React from "react"
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"
import { RxCross2 } from "react-icons/rx"
import { RiDivideLine } from "react-icons/ri"
import { VscRepoForked } from "react-icons/vsc"
import { HiVariable } from "react-icons/hi"
import { MdOutput } from "react-icons/md"


interface tittleWithIconInterface {
    title: string
}

export function TitleWithIcon({title}: tittleWithIconInterface) {

    let iconJSX = <div></div>
    const iconSize = 21
    const iconColor = "white"
    switch(title) {
        case "Variable":
            iconJSX = <HiVariable size = {iconSize} color = {iconColor}/>
            break
        case "Output":
            iconJSX = <MdOutput size = {iconSize} color = {iconColor}/>
            break
        case "Add":
            iconJSX = <AiOutlinePlus size = {iconSize} color = {iconColor}/>
            break
        case "Substract":
            iconJSX = <AiOutlineMinus size = {iconSize} color = {iconColor}/>
            break
        case "Multiply":
            iconJSX = <RxCross2 size = {iconSize} color = {iconColor}/>
            break
        case "Divide":
            iconJSX = <RiDivideLine size = {iconSize} color = {iconColor}/>
            break
        case "Fork":
            iconJSX = <VscRepoForked size = {iconSize} color = {iconColor}/>
            break
    }

    return (
        <div className = "flex flex-row gap-1 items-center ">
            {iconJSX}
            <div className = "text-xl text-white">{title}</div>
        </div>
    )

}