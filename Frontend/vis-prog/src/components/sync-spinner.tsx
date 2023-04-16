import React from "react"
import { ImSpinner2 } from "react-icons/im"
import { AsyncStatus } from "../store/workspaces-subroutines/types"

interface SpinnerProps {
    show: boolean,
    status: AsyncStatus
}


const spinnerSize = 15

export const Spinner: React.FC<SpinnerProps> = ({show, status}) => {

    let spinnerContent = <></>

    if (show) {
        switch (status) {
            case "idle":
                spinnerContent = <div className ="absolute bottom-0 px-2 right-0 text-white bg-green-600">Successful sync. to cloud</div>
                break
            case "loading":
                spinnerContent = (
                    <div className ="absolute bottom-0 px-2 right-0 text-white bg-yellow-600 z-10 flex flex-row gap-2 items-center">
                        <ImSpinner2 className = "animate-spin" size = {spinnerSize} color = {"white"}/>
                        <div>Syncing to cloud</div>
                    </div>
                    )
                break
            case "failed":
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