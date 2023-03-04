import React from "react"

interface SpinnerProps {
    show: boolean,
    status: "success" | "idle" | "failure"
}

export function Spinner({show, status}: SpinnerProps) {

    let spinnerContent = <div></div>

    if (show) {
        switch (status) {
            case "success":
                spinnerContent = <div className ="absolute bottom-0 px-2 right-0 text-white bg-green-600">Successful sync. to cloud</div>
                break
            case "idle":
                spinnerContent = <div className ="absolute bottom-0 px-2 right-0 text-white bg-yellow-600 z-10">Syncing to cloud</div>
                break
            case "failure":
                spinnerContent = <div className ="absolute bottom-0 px-2 right-0 text-white bg-red-600">Failed sync. to cloud</div>
                break
            }
    } else {
        spinnerContent = <div className ="absolute bottom-0 right-0 text-lg bg-red-500"></div>
    }

    return (spinnerContent)
}