'use client'

import { useRouter } from "next/navigation"
import { DeleteIcon } from "../DeleteIcon/deleteIcon"
import { EditableField } from "../EditableField"
import { Box, Flex, IconButton } from "@chakra-ui/react"
import Link from "next/link"

type UpdateProjectProps = {
    uuid: string,
    fields: {
        name: string,
    }
}

type ProjectCardProps = {
    focus?: boolean,
    color: string
    uuid: string,
    name: string
    settingsCount: number
    updateProject: (props: UpdateProjectProps) => void
    deleteProject: () => void
}
type hexToCssHslProps = {
    hex: string,
    valuesOnly?: boolean,
    ch?: number,
    cl?: number,
    cs?: number,
}

function hexToCssHsl({
    hex, 
    valuesOnly = false,
    ch = 0,
    cl = 0,
    cs = 0
}: hexToCssHslProps) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        return hex
    }
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);
    var cssString = '';

    r /= 255;
    g /= 255;
    b /= 255;
    
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);

    var h = (max + min) / 2;
    var s = (max + min) / 2;
    var l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    h = Math.round((h * 360) + ch);
    s = Math.round((s * 100) + cs);
    l = Math.round((l * 100) + cl);
    
    cssString = h + ',' + s + '%,' + l + '%';
    cssString = !valuesOnly ? 'hsl(' + cssString + ')' : cssString;
    
    return cssString;
}

export function ProjectCard({
    focus = false,
    color,
    uuid,
    name,
    settingsCount,
    updateProject,
    deleteProject,
}: ProjectCardProps): JSX.Element {
    const router = useRouter()

    return (
        <Flex
            as={Box}
            position="relative"
            bg={color}
            minHeight={48}
            flexDirection="column"
            justifyContent="space-around"
            borderRadius={8}
            alignItems="center"
            border="3px solid transparent"
            transitionProperty="transform"
            transitionDuration="0.2s"
            _hover={{
                bg: color,
                border: `3px solid ${hexToCssHsl({
                    hex: color,
                    cl: -20,
                })}`,
                padding: 0,
                transform: 'scale(1.02)'
            }}
        >
            <Box
                as={Link}
                position="absolute"
                width="100%"
                height="100%"
                href={`/project/${uuid}`}
            />

            <EditableField
                position="absolute"
                maxW="90%"
                padding={3}
                fontFamily="system-ui, helvetica"
                fontSize="20px"
                letterSpacing="-0.05em"
                fontWeight="700"
                textAlign="center"

                focus={focus}
                editCallback={(fieldValue: string) => {
                    if (fieldValue !== name) {
                        updateProject({
                            uuid,
                            fields: {
                                name: fieldValue,
                            }
                        })
                    }
                }}
            >{name}</EditableField>

            <IconButton 
                variant="text"
                position="absolute"
                right={2}
                top={2}
                alignSelf="flex-end"
                opacity="0.4"
                _hover={{
                    opacity: "1",
                }}
                aria-label="delete project"
                onClick={(e) => {
                    e.stopPropagation()
                    deleteProject()
                }}
                icon={<DeleteIcon />}
            />

            <Box 
                position="absolute"
                right={3}
                bottom={3}
                fontWeight="normal"
                fontFamily="body"
                fontSize="xs"
                alignSelf="flex-end"
            >{`${settingsCount} settings`}</Box>
            
        </Flex>
    )
}