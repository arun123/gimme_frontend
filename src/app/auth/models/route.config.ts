export const routeConfig = {
    dashboard: {
        route: 'dashboard',
        roles: ['ROLE_ADMIN']
    },
    receiving: {
        route: '',
        roles: [],
        // children: {
        //     waves: {
        //         route: 'waves',
        //         roles: ['ROLE_ADMIN']
        //     }
        // }
    },
    admin: {
        route: '',
        roles: [],
        children: {
            users: {
                route: 'users',
                roles: []
            }
        }
    }
}