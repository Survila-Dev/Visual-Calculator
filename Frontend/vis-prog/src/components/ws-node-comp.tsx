import { WSNode } from "./ws-node"

export const WSNodeAddition = WSNode({
    type: "addition",
    title: "Add",
    listOfPorts: [
        {id: 0, position: {side: "left", row: 0}, jsxInput: <div>A</div>},
        {id: 1, position: {side: "left", row: 1}, jsxInput: <div>B</div>},
        {id: 2, position: {side: "right", row: 0}, jsxInput: <div>A + B</div>}
    ]
})

export const WSNodeSubtraction = WSNode({
    type: "substraction",
    title: "Substract",
    listOfPorts: [
        {id: 0, position: {side: "left", row: 0}, jsxInput: <div>A</div>},
        {id: 1, position: {side: "left", row: 1}, jsxInput: <div>B</div>},
        {id: 2, position: {side: "right", row: 0}, jsxInput: <div>A - B</div>}
    ]
})

export const WSNodeMultiplication = WSNode({
    type: "multiplication",
    title: "Multiply",
    listOfPorts: [
        {id: 0, position: {side: "left", row: 0}, jsxInput: <div>A</div>},
        {id: 1, position: {side: "left", row: 1}, jsxInput: <div>B</div>},
        {id: 2, position: {side: "right", row: 0}, jsxInput: <div>A * B</div>}
    ]
})

export const WSNodeDivision = WSNode({
    type: "division",
    title: "Divide",
    listOfPorts: [
        {id: 0, position: {side: "left", row: 0}, jsxInput: <div>A</div>},
        {id: 1, position: {side: "left", row: 1}, jsxInput: <div>B</div>},
        {id: 2, position: {side: "right", row: 0}, jsxInput: <div>A / B</div>}
    ]
})

export const WSNodeConstant = WSNode({
    type: "constant",
    title: "Variable",
    listOfPorts: [
        {id: 0, position: {side: "right", row: 0}, jsxInput: <div>empty</div>},
    ]
})

export const WSNodeOutput = WSNode({
    type: "output",
    title: "Output",
    listOfPorts: [
        {id: 0, position: {side: "left", row: 0}, jsxInput: <div>empty</div>},
    ]
})