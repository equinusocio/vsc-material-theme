import {IThemeCustomSettings} from '../interfaces/itheme-custom-properties';
import {IDefaults} from '../interfaces/idefaults';

export interface IChangeType {
  children: Array<{
    text: string;
  }>;
}
export interface IPost {
  title: string;
  version: string;
  fixed: IChangeType[];
  new: IChangeType[];
  breaking: IChangeType[];
}
export interface IPostNormalized {
  title: string;
  version: string;
  fixed: string[];
  new: string[];
  breaking: string[];
}
export interface ISettingsChangedMessage {
  type: 'settingsChanged';
  config: IThemeCustomSettings;
}

export interface ISaveSettingsMessage {
  type: 'saveSettings';
  changes: {
    [key: string]: any;
  };
  removes: string[];
  scope: 'user' | 'workspace';
  uri: string;
}

export type Message = ISaveSettingsMessage | ISettingsChangedMessage;
export type Invalidates = 'all' | 'config' | undefined;

export interface IBootstrap {
  config: IThemeCustomSettings;
}

export interface ISettingsBootstrap extends IBootstrap {
  scope: 'user' | 'workspace';
  scopes: Array<['user' | 'workspace', string]>;
  defaults: IDefaults;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Window {
    bootstrap: IBootstrap | ISettingsBootstrap | {};
  }
}
