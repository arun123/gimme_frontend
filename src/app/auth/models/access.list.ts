export const accessList = [
    {
        name: 'dashboard',
        displayName: 'Dashboard',
        iconName: 'fa fa-columns',
        route: 'dashboard'
    },

    {
        name: 'settings',
        displayName: 'Settings',
        iconName: 'fa fa-cogs',
        route: '',
        children: [
            {
                name: 'authors',
                displayName: 'Authors',
                iconName: 'fas fa-pen-nib',
                route: 'authors',
            },
            {
                name: 'books',
                displayName: 'Books',
                iconName: 'fas fa-book',
                route: 'books',
            },
            {
                name: 'genres',
                displayName: 'Genres',
                iconName: 'fas fa-tags',
                route: 'genres',
            },
            {
                name: 'stocks',
                displayName: 'Stock',
                iconName: 'fas fa-layer-group',
                route: 'stocks',
            },


        ]
    },
    {
        name: 'admin',
        displayName: 'Admin',
        iconName: 'fas fa-user-shield',
        route: '',
        roles: ['ROLE_ADMIN'],
        children: [
            {
                name: 'admin.users',
                displayName: 'Users',
                iconName: 'fa fa-users',
                route: 'users',
                crud: [
                    {
                        name: 'admin.users.create',
                        displayName: 'Add Users',
                        route: ''
                    },
                    {
                        name: 'admin.users.view',
                        displayName: 'View Users',
                        route: ''
                    },
                    {
                        name: 'admin.users.update',
                        displayName: 'Edit Users',
                        route: ''
                    },
                    {
                        name: 'admin.users.delete',
                        displayName: 'Delete Users',
                        route: ''
                    }
                ]
            },
            {
                name: 'admin.roles',
                displayName: 'Roles',
                iconName: 'fas fa-user-tag',
                route: 'roles'
            }
        ]
    },
];