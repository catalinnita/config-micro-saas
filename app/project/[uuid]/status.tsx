import { Label } from "@/components/Label"
import { useEffect, useState } from "react"

type StatusProps = {
    initialStatus: string
    updateCallback: ({statusValue}: {statusValue: string}) => void
}

export function Status({
    initialStatus,
    updateCallback
}: StatusProps) {
    const statusList = ['published', 'disabled', 'draft']
    const [currentIndex, setCurrentIndex] = useState(statusList.indexOf(initialStatus))
    
    useEffect(() => {
        if (initialStatus !== statusList[currentIndex])
        updateCallback({
            statusValue: statusList[currentIndex]
        })
    }, [currentIndex])

    return (
        <div 
            style={{
                cursor: 'pointer'
            }}
            onClick={() => {
                setCurrentIndex((currentIndex + 1) % statusList.length)
            }}
        >
            <Label>{statusList[currentIndex]}</Label>
        </div>
    )
}