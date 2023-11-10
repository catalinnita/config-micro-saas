import { ThreeDotsIcon } from "@/components/ThreeDotsIcon/ThreeDotsIcon";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

type SectionMenuProps = {
    deleteSection: () => void
}

export function SectionMenu({
    deleteSection
}: SectionMenuProps) {
    const [showMenu, setShowMenu] = useState(false)
    
    return (
        <Box 
            position="absolute"
            top={2}
            right={0}
        >
            <div onClick={() => {
                setShowMenu(!showMenu)
            }}>
                <ThreeDotsIcon />
            </div>
            {showMenu && <Box style={{
                zIndex: 1,
                position: 'absolute',
                right: 0,
                background: 'white',
                color: 'black',
                whiteSpace: 'nowrap'
                
            }}
                overflow="hidden"
                borderRadius={6}
                fontSize="sm"
            >
                <div style={{
                    padding: '5px 10px',
                    cursor: 'pointer'
                }}>Add Section</div>

                <div style={{
                    padding: '5px 10px',
                    cursor: 'pointer'
                }}
                onClick={() => {
                    deleteSection()
                }}
                >Remove</div>

                <div style={{
                    padding: '5px 10px',
                    cursor: 'pointer'
                }}>Archive</div>
            </Box>}
        </Box>
    )
}