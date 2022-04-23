import { ApplicationInfo } from './ApplicationInfo'

export interface InfoProps {
  info: ApplicationInfo;
}

export interface IViewProps extends InfoProps {
  id: string;
}

export interface IPanelProps extends InfoProps {
  id: string;
}
