import React from "react"

interface WSNodePortProps {
    id: number,
    position: {side: "left" | "right", row: number}
}

export function WSNodePort({id, position} :WSNodePortProps): JSX.Element {

    function convertPositionToStyle(position : {side: "left" | "right", row: number}) {

        const portLateralOffset = 12
        const portRowOffset = 22
        const portRowStartOffset = 10

        const vertOffset = portRowStartOffset + portRowOffset * position.row;

        if (position.side === "left") {
            return ({
                top: vertOffset + "px",
                left: (-portLateralOffset) + "px"
            })
        } else {
            return ({
                top: vertOffset + "px",
                right: (-portLateralOffset) + "px"
            })
        }
    }

    function preventDefaultReaction(e: React.FormEvent) {
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <div
            id = {id as any as string}
            className = "absolute w-3 h-3 bg-slate-500 cursor-pointer hover:bg-slate-700"
            style = {convertPositionToStyle(position)}
            onMouseDown = {preventDefaultReaction}
            onMouseUp = {preventDefaultReaction}
        >
        </div>
    )
}