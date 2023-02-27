import React from "react"
import { useAppDispatch, useAppSelector } from "../store/index";
import { canvasCurveActions } from "../store/canvas-curves"

interface BackCanvasInteface {
    mousePosition: {x: number, y: number},
}

export function BackCanvas({mousePosition} :BackCanvasInteface):JSX.Element {

    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

    const listOfCurves = useAppSelector((state) => state.canvasStateReducers)
    const trackMouse = useAppSelector((state) => state.mouseTrackReducer.track)
    const trackMouseFromPoint = useAppSelector((state) => state.mouseTrackReducer.startPoint)

    const defaultLineColor = '#1f2937'

    function draw(drawToMouse: boolean = false, pointToDrawToMouse?: {x: number, y: number}) {

        let xOffset = 0
        let yOffset = 0
        
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect()
            xOffset = -rect.left
            yOffset = -rect.top
        }

        function drawSingleConnection(
            ctx: CanvasRenderingContext2D,
            point1: {x: number, y: number},
            point2: {x: number, y:number},
            color: string = defaultLineColor) {

            ctx.strokeStyle = color;
            ctx.moveTo(point1.x + xOffset, point1.y + yOffset);
            ctx.bezierCurveTo(
                (point1.x + point2.x)/2 + xOffset, point1.y + yOffset,
                (point1.x + point2.x)/2 + xOffset, point2.y + yOffset,
                point2.x + xOffset, point2.y + yOffset);
            
        }

        const canvas = canvasRef.current
        let ctx : null | CanvasRenderingContext2D = null;
        if (canvas) {
            ctx = canvas.getContext('2d')
        }
        if (ctx && canvas) {
            // drawing everything here
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath()
            ctx.lineWidth = 4;
            
            listOfCurves.forEach((curCurve) => {
                if (ctx) drawSingleConnection(ctx, curCurve.firstPortPosition, curCurve.secondPortPosition)}
            )
            
            if (drawToMouse && pointToDrawToMouse) {
                drawSingleConnection(ctx, pointToDrawToMouse, mousePosition)
            }
            ctx.stroke();
        }
    }

    React.useEffect(() => {
        // Resizing the canvas and adding listener for windows resize
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
        function handleResize(this: Window, e: UIEvent){
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
            draw(trackMouse, trackMouseFromPoint)
        }
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    React.useEffect(() => {
        draw(trackMouse, trackMouseFromPoint)
    }, [mousePosition])

    return (
        <canvas
            ref = {canvasRef}
            className="absolute bg-gray-700 object-cover aspect-1 -z-10"
        />
    )
}