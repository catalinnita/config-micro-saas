'use client'

import { Button, FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUsers } from "./useUsers";
import { redirect } from "next/navigation";

type NameFormProps = {
    userId: string
}

export function NameForm({
    userId
}: NameFormProps) {
    const { updateUsers, data, error } = useUsers({ userId });
    const [nameValue, setNameValue] = useState('')
    const disabledButton = nameValue.length < 3
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameValue(e.target.value)
    }

    const handleNameUpdate = () => {
        updateUsers({
            fields: {
                full_name: nameValue
            }
        })
    }

    useEffect(() => {
        if (data?.updateusersCollection?.records[0]?.id === userId && !error) {
            return redirect('/dashboard')
        }
    }, [data, error])
    
    return (
        <FormControl>
            <FormLabel>Your Name</FormLabel>
            <Input 
                name="name"
                type="text" 
                isRequired
                onInput={handleInputChange}
            />
            <FormHelperText>Please enter your full name, we don't want to make your email visible so we'll use the name instead</FormHelperText>
            <Button 
                size="sm" 
                mt={4} 
                colorScheme="purple" 
                isDisabled={disabledButton}
                onClick={handleNameUpdate}
            >Continue</Button>
        </FormControl>)
}