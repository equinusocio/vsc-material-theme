import {WebviewController} from './Webview';
import {
  workspace as Workspace
} from 'vscode';
import {SettingsBootstrap} from './interfaces';
import {getCustomSettings} from '../helpers/settings';
import {getDefaultValues} from '../helpers/fs';

export class SettingsWebview extends WebviewController<SettingsBootstrap> {
  get filename(): string {
    return 'settings.html';
  }

  get id(): string {
    return 'materialTheme.settings';
  }

  get title(): string {
    return 'Material Theme Settings';
  }

  /**
   * This will be called by the WebviewController when init the view
   * passing as `window.bootstrap` to the view.
   */
  getBootstrap(): SettingsBootstrap {
    return {
      config: getCustomSettings(),
      defaults: getDefaultValues(),
      scope: 'user',
      scopes: this.getAvailableScopes()
    };
  }

  private getAvailableScopes(): Array<['user' | 'workspace', string]> {
    const scopes: Array<['user' | 'workspace', string]> = [['user', 'User']];
    return scopes
      .concat(
        Workspace.workspaceFolders?.length ?
          ['workspace', 'Workspace'] :
          []
      );
  }
}
