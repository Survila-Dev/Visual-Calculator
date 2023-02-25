import React from "react"

interface BackCanvasInteface {
    mousePosition: {x: number, y: number}
}

export function BackCanvas({mousePosition} :BackCanvasInteface):JSX.Element {

    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

    function draw() {
        const canvas = canvasRef.current
        let ctx = null;
        if (canvas) {
            ctx = canvas.getContext('2d')
        }
        if (ctx && canvas) {

            // drawing everything here
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(canvas.width, canvas.height); 
            ctx.moveTo(canvas.width, 0);
            ctx.lineTo(0, canvas.height); 
            ctx.moveTo(canvas.width/2, canvas.height/2);
            ctx.lineTo(mousePosition.x, mousePosition.y); 
            ctx.stroke();

            
        }
    }

    React.useEffect(() => {
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
        draw()
    }, [mousePosition])

    return (
        <canvas ref = {canvasRef} className="absolute bg-yellow-100 object-cover aspect-1 h-full w-full -z-10"/>
    )
}