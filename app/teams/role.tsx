import { Label } from "@/components/Label"
import { useEffect, useState } from "react"

type RoleProps = {
    initialRole: string
    updateCallback: ({roleValue}: {roleValue: string}) => void
}

export function Role({
    initialRole,
    updateCallback
}: RoleProps) {
    const rolesList = ['admin', 'member']
    const [currentIndex, setCurrentIndex] = useState(rolesList.indexOf(initialRole))
    
    useEffect(() => {
        if (initialRole !== rolesList[currentIndex])
        updateCallback({
            roleValue: rolesList[currentIndex]
        })
    }, [currentIndex])

    return (
        <div 
            style={{
                cursor: 'pointer'
            }}
            onClick={() => {
                // TO DO: check if current user is allowed to change the role
                setCurrentIndex((currentIndex + 1) % rolesList.length)
            }}
        >
            <Label>{rolesList[currentIndex]}</Label>
        </div>
    )
}