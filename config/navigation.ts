export type NavigationItem = {
    link: string,
    label: string,
}

export const navigationItems: NavigationItem[] = [{
    label: 'Dashboard',
    link: '/dashboard'
}, {
    label: 'Teams and Roles',
    link: '/teams'
}, {
    label: 'API',
    link: '/tokens'
}, {
    label: 'Account',
    link: '/account'
}]