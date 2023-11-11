type LabelProps = {
    children: string
}

export function Label({
    children
}: LabelProps) {

    const getColor = (status: string) => {
        switch(status) {
            case 'published':
                return {
                    background: 'green',
                    borderColor: 'green',
                    color: 'white'
                }
            case 'admin':
                return {
                    background: 'navy',
                    borderColor: 'navy',
                    color: 'white'
                }
            case 'disabled': 
                return {
                    background: 'grey',
                    borderColor: 'grey',
                    color: 'white'
                }
            default:
                return {
                    background: 'white',
                    borderColor: 'grey',
                    color: 'grey'
                }
        }
    }
    return (
        <div style={{
            display: 'inline-block',
            fontSize: '11px',
            padding: '4px 8px',
            borderRadius: '10px',
            lineHeight: '11px',
            borderWidth: '1px',
            borderStyle: 'solid',
            textTransform: 'uppercase',
            fontWeight: 600,

            ...getColor(children)
        }}>
            {children}
        </div>
    )
}