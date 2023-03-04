import React from "react"
import { ImSpinner2 } from "react-icons/im"

interface SpinnerProps {
    show: boolean,
    status: "success" | "idle" | "failure" | "not logged in"
}

export function Spinner({show, status}: SpinnerProps) {

    let spinnerContent = <div></div>

    if (show) {
        switch (status) {
            case "success":
                spinnerContent = <div className ="absolute bottom-0 px-2 right-0 text-white bg-green-600">Successful sync. to cloud</div>
                break
            case "idle":
                spinnerContent = (
                    <div className ="absolute bottom-0 px-2 right-0 text-white bg-yellow-600 z-10 flex flex-row gap-2 items-center">
                        <ImSpinner2 className = "animate-spin" size = {15} color = {"white"}/>
                        <div>Syncing to cloud</div>
                    </div>
                    )
                break
            case "failure":
                spinnerContent = <div className ="absolute bottom-0 px-2 right-0 text-white bg-red-600">Failed sync. to cloud</div>
                break
            case "not logged in":
                spinnerContent = <div className ="absolute bottom-0 px-2 right-0 text-white bg-red-600">Log in to sync. to cloud</div>
                break
            }
    } else {
        spinnerContent = <div className ="absolute bottom-0 right-0 text-lg bg-red-500"></div>
    }

    return (spinnerContent)
}