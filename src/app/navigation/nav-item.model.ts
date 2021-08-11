export interface NavItem {
    name: string;
    displayName: string;
    disabled?: boolean;
    iconName: string;
    route?: string;
    children?: NavItem[];
    roles?: any
    crud?: NavItem[];
    param: string;
    param_value: string;
}
  