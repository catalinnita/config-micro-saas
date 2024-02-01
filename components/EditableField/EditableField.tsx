import type { Styles } from "@chakra-ui/theme-tools"
import { Box, PropsOf } from "@chakra-ui/react"
import { MouseEvent, useEffect, useRef, useState } from "react"

type EditableFieldProps = {
    canEdit?: boolean
    children: string
    editCallback: (fieldValue: string) => void
    focus?: boolean
    style?: Styles
} & PropsOf<typeof Box>

type GetCaretProps = {
    el: HTMLDivElement
}

function getCaret({
    el
}: GetCaretProps) {
    let caretAt = 0;
    const sel = window.getSelection();
    
    if ( !sel || sel.rangeCount == 0 ) { 
        return caretAt; 
    }
  
    const range = sel.getRangeAt(0);    
    const preRange = range.cloneRange();
    preRange.selectNodeContents(el);
    preRange.setEnd(range.endContainer, range.endOffset);
    caretAt = preRange.toString().length;
  
    return caretAt;   
  }
  
type SetCaretProps = {
    el: HTMLDivElement
    offset?: number
}

function setCaret({
    el, 
    offset = 0
}: SetCaretProps) {
    let sel = window.getSelection();
    let range = document.createRange();

    if (!sel || !el || !el.childNodes[0]){
        return null;
    }
    
    range.setStart(el.childNodes[0], offset);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

type SelectAllProps = {
    el: HTMLDivElement
    offset?: number
}

function selectAll({
    el, 
    offset = 0
}: SelectAllProps) {
    let sel = window.getSelection();
    let range = document.createRange();

    if (!sel || !el || !el.childNodes[0]){
        return null;
    }
    
    range.setStart(el.childNodes[0], offset);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    range.selectNodeContents(el);
  }

export function EditableField({
    focus=false,
    children,
    canEdit=true,
    editCallback,
    ...rest
}: EditableFieldProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const caretPos = useRef<number>(0);
    const [fieldValue, setFieldValue] = useState(children)
    const [contentEditable, setContentEditable] = useState(false)
    const enableEdit = (e: MouseEvent) => {
        if (!canEdit) {
            return false
        }
        e.preventDefault()
        e.stopPropagation()
        if(e.detail == 2){
			setContentEditable(true)
		}
    }

    useEffect(() => {
        if (focus === true) {
            setContentEditable(true)
            contentRef.current && contentRef.current.focus()
        }
    }, [focus])

    useEffect(() => {
        if (contentRef.current) {
            setCaret({
                el: contentRef.current, 
                offset: caretPos.current
            });
        }
        contentRef.current && contentRef.current.focus()
      }, [fieldValue, contentEditable]);

    return (
        <Box
            border="1px solid transparent"
            background="transparent"
            borderRadius={8}
            maxW="100%"
            px={2}
            py={1}
            fontFamily="system-ui, helvetica"
            fontSize="sm"
            letterSpacing="-0.05em"
            fontWeight="medium"
            textAlign="left"
            whiteSpace="normal"
            lineHeight="shorter"
            _hover={{
                border: canEdit ? '1px dashed rgba(0,0,0,0.2)' : ''
            }}
            _focus={{
                outline: 0,
                background: 'rgba(0,0,0,0.1)',
                border: '1px dashed rgba(0,0,0,0.2)'
            }}

            {...rest}

            ref={contentRef}
            suppressContentEditableWarning={true}
            contentEditable={contentEditable}
            onClick={enableEdit}
            onFocus={() => {
                if (contentRef.current) {
                    selectAll({
                        el: contentRef.current
                    })}
                }
            }
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (contentRef.current) {
                    caretPos.current = getCaret({
                        el: contentRef.current
                    });
                }
                setFieldValue(e.target.innerText)
            }}
            onBlur={() => {
                editCallback(fieldValue)
                setContentEditable(false)
            }}
        >
            { fieldValue }
        </Box>

    )

}