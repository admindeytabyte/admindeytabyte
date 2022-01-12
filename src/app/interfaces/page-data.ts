import { Breadcrumb } from './breadcrumbs';

export interface PageData {
  title: string;
  loaded?: boolean;
  breadcrumbs?: Breadcrumb[];
  fullFilled?: boolean;
}
