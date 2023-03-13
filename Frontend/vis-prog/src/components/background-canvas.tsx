import React from "react"
import { useAppSelector } from "../store/index";

interface BackCanvasInteface {
    mousePosition: {x: number, y: number},
    fieldCOS: {x: number, y: number}
}

const defaultConnectionLineColor = '#1f2937'
    const gridLineColor = '#1f2937'
    const connectionLineThickness = 7.5
    const gridLineThickness = 0.5
    const backgroundGridSpacing = 150

export const BackCanvas: React.FC<BackCanvasInteface> = ({mousePosition, fieldCOS}) => {

    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

    const listOfCurves = useAppSelector((state) => state.workspaceStateReducers.currentCurveConnections)
    const trackMouse = useAppSelector((state) => state.mouseTrackReducer.track)
    const trackMouseFromPoint = useAppSelector((state) => state.mouseTrackReducer.startPoint)

    function draw(drawToMouse: boolean = false, pointToDrawToMouse?: {x: number, y: number}) {

        let xOffset = 0
        let yOffset = 0
        
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect()
            xOffset = -rect.left
            yOffset = -rect.top
        }

        function drawBackgroundGrid(
            ctx: CanvasRenderingContext2D,
            fieldCOS: {x: number, y: number}) {
            if (canvasRef.current) {
        
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.beginPath()
                ctx.lineWidth = gridLineThickness
                ctx.strokeStyle = gridLineColor

                const noOfVerticalLines = Math.floor(canvasRef.current.width / backgroundGridSpacing)
                const noOfHorizontalLines = Math.floor(canvasRef.current.height / backgroundGridSpacing)
        
                for (let i = 0; i<noOfVerticalLines+2; i++) {
                    ctx.moveTo(0 - (fieldCOS.x % backgroundGridSpacing) + i * backgroundGridSpacing, 0)
                    ctx.lineTo(0 - (fieldCOS.x % backgroundGridSpacing) + i * backgroundGridSpacing, canvasRef.current.height)
                }
                for (let i = 0; i<noOfHorizontalLines+2; i++) {
                    ctx.moveTo(0, 0 - (fieldCOS.y % backgroundGridSpacing) + i * backgroundGridSpacing)
                    ctx.lineTo(canvasRef.current.width, 0 - (fieldCOS.y % backgroundGridSpacing) + i * backgroundGridSpacing)
                }
                ctx.stroke();
            }
        }
        
        function drawSingleConnectionCurve(
            ctx: CanvasRenderingContext2D,
            point1: {x: number, y: number},
            point2: {x: number, y:number},
            color: string = defaultConnectionLineColor) {

            ctx.beginPath()
            ctx.lineWidth = connectionLineThickness;
        
            ctx.strokeStyle = color;
            ctx.moveTo(point1.x + xOffset, point1.y + yOffset);
            ctx.bezierCurveTo(
                (point1.x + point2.x)/2 + xOffset, point1.y + yOffset,
                (point1.x + point2.x)/2 + xOffset, point2.y + yOffset,
                point2.x + xOffset, point2.y + yOffset);
            ctx.stroke();
            
        }

        const canvas = canvasRef.current
        let ctx : null | CanvasRenderingContext2D = null;
        if (canvas) {
            ctx = canvas.getContext('2d')
        }
        if (ctx && canvas) {
            // executing all drawing commands here
            drawBackgroundGrid(ctx, fieldCOS)
            if (listOfCurves) {
                listOfCurves.forEach((curCurve) => {
                    if (ctx) drawSingleConnectionCurve(ctx, curCurve.firstPortPosition, curCurve.secondPortPosition)}
                )
            }
            if (drawToMouse && pointToDrawToMouse) {
                drawSingleConnectionCurve(ctx, pointToDrawToMouse, mousePosition)
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
        <canvas
            ref = {canvasRef}
            className="absolute bg-gray-700 object-cover aspect-1 -z-10"
        />
    )
}