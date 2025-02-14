export const Permissions = {

    ReadAnyUser: 'read:any_user',
    WriteAnyUser: 'write:any_user',
    DeleteAnyUser: 'delete:any_user',
    ManageRoles: 'manage:roles',
    ManageSettings: 'manage:settings',
    AccessAdminPanel: 'access:admin_panel',
    ManageOrganizations: 'manage:organizations',
    ViewMetrics: 'view:metrics',
    ManageApiKeys: 'manage:api_keys',
    
    ReadAssignedUsers: 'read:assigned_users',
    WriteAssignedUsers: 'write:assigned_users',
    ManageContent: 'manage:content',

    ReadOwnProfile: 'read:own_profile',
    WriteOwnProfile: 'write:own_profile',
    AccessBasicFeatures: 'access:basic_features'
} as const;
