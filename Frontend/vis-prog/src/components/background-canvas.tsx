import React from "react"

interface BackCanvasInteface {
    mousePosition: {x: number, y: number}
}

export function BackCanvas({mousePosition} :BackCanvasInteface):JSX.Element {

    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

    function draw(drawToMouse: boolean = false, pointToDrawToMouse?: {x: number, y: number}) {

        function drawConnection(
                ctx: CanvasRenderingContext2D,
                point1: {x: number, y: number},
                point2: {x: number, y:number},
                color: string = '#ff0000') {
            ctx.strokeStyle = color;
            ctx.moveTo(point1.x, point1.y);
            ctx.bezierCurveTo(
                (point1.x + point2.x)/2, point1.y,
                (point1.x + point2.x)/2, point2.y,
                point2.x, point2.y);
        }

        const canvas = canvasRef.current
        let ctx = null;
        if (canvas) {
            ctx = canvas.getContext('2d')
        }
        if (ctx && canvas) {
            // drawing everything here
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();

            ctx.lineWidth = 7.5;
            

            if (drawToMouse && pointToDrawToMouse) {
                drawConnection(ctx, pointToDrawToMouse, mousePosition)
            }
            ctx.stroke();
        }
    }

    React.useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
        function handleResize(this: Window, e: UIEvent){
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
            draw()
        }
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    React.useEffect(() => {
        draw(true, {x: 100, y: 100})
    }, [mousePosition])

    return (
        <canvas ref = {canvasRef} className="absolute bg-yellow-100 object-cover aspect-1 h-full w-full -z-10"/>
    )
}