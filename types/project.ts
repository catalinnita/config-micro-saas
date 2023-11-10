type ColorValueHex = `#${string}`
type ProjectStatus = 'published' | 'draft' | 'disabled' | 'archived'
type ProjectSettingType = 'json' | 'string' | 'boolean' | 'encrypted' | 'html' | 'list' | 'collection'

type ProjectSection = {
    uuid: string,
    
    created_at: Date,
    updated_at: Date,

    name: string,
    description?: string,

    status: ProjectStatus,
}

type ProjectSetting = {
    uuid: string,

    created_at: Date,
    updated_at: Date,

    name: string,
    status: ProjectStatus,
    type: ProjectSettingType,

    value: any,
}

type Project = {
    uuid: string,
    
    created_at: Date,
    updated_at: Date,

    name: string,
    description?: string,
    color: ColorValueHex,

    status: ProjectStatus,

    settings: {
        section: ProjectSection,
        settings: ProjectSetting[],
    }
}