import React from "react"
import { useAppDispatch, useAppSelector } from "../store/index";
import { canvasCurveActions } from "../store/canvas-curves"

interface BackCanvasInteface {
    mousePosition: {x: number, y: number}
}

export function BackCanvas({mousePosition} :BackCanvasInteface):JSX.Element {

    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const listOfCurves = useAppSelector((state) => state.canvasStateReducers)
    const trackMouse = useAppSelector((state) => state.mouseTrackReducer.track)
    const trackMouseFromPoint = useAppSelector((state) => state.mouseTrackReducer.startPoint)

    function draw(drawToMouse: boolean = false, pointToDrawToMouse?: {x: number, y: number}) {

        function drawSingleConnection(
            ctx: CanvasRenderingContext2D,
            point1: {x: number, y: number},
            point2: {x: number, y:number},
            color: string = '#ff0000') {

            ctx.beginPath()
            ctx.strokeStyle = color;
            ctx.moveTo(point1.x, point1.y);
            ctx.bezierCurveTo(
                (point1.x + point2.x)/2, point1.y,
                (point1.x + point2.x)/2, point2.y,
                point2.x, point2.y);
            ctx.stroke();
        }

        const canvas = canvasRef.current
        let ctx : null | CanvasRenderingContext2D = null;
        if (canvas) {
            ctx = canvas.getContext('2d')
        }
        if (ctx && canvas) {
            // drawing everything here
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.lineWidth = 7.5;
            
            listOfCurves.forEach((curCurve) => {
                if (ctx) drawSingleConnection(ctx, curCurve.firstPortPosition, curCurve.secondPortPosition)}
            )
            
            if (drawToMouse && pointToDrawToMouse) {
                drawSingleConnection(ctx, pointToDrawToMouse, mousePosition)
            }
            
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
        <canvas ref = {canvasRef} className="absolute bg-yellow-100 object-cover aspect-1 h-full w-full -z-10"/>
    )
}