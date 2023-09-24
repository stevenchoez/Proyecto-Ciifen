export interface MenuItem {
  id?: number;
  label?: string;
  icon?: string;
  link?: string;
  path?: string;
  expanded?: boolean;
  subItems?: any;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
}
