import {
  workspace as Workspace,
  commands as Commands,
  window as Window,
  ConfigurationChangeEvent
} from 'vscode';

import * as ThemeCommands from './commands';
import {shouldShowChangelog, showChangelog} from './helpers/changelog';
import {reloadWindow, getCurrentThemeID} from './helpers/vscode';
import {isMaterialTheme, isAutoApplyEnable} from './helpers/settings';

const INFO_MESSAGE = 'You should reload the window for full activate the Material Theme.';
const OPTIONS = {ok: 'Reload now', cancel: 'Cancel'};

const icons = () =>
  ThemeCommands.fixIcons()
    .then(() => reloadWindow())
    .catch((error: NodeJS.ErrnoException) => console.trace(error));

const infoMessage = async () => {
  if (await Window.showInformationMessage(INFO_MESSAGE, OPTIONS.ok, OPTIONS.cancel) === OPTIONS.ok) {
    icons();
  }
};

const onChangeConfiguration = (event: ConfigurationChangeEvent) => {
  const isColorTheme = event.affectsConfiguration('workbench.colorTheme');
  const currentTheme = getCurrentThemeID();

  switch (true) {
    case !isMaterialTheme(currentTheme) || !isColorTheme:
      return;
    case !isAutoApplyEnable():
      return infoMessage();
    default:
      icons();
  }
};

export function activate() {
  const config = Workspace.getConfiguration();

  // Listen on set theme: when the theme is Material Theme, just adjust icon and accent.
  Workspace.onDidChangeConfiguration(onChangeConfiguration);

  // Delete old configuration, must remove with next major release
  if (config.has('materialTheme.cache.workbench')) {
    config.update('materialTheme.cache.workbench', undefined, true);
  }

  if (shouldShowChangelog()) {
    showChangelog();
  }

  // Registering commands
  Commands.registerCommand('materialTheme.setAccent', async () => {
    await ThemeCommands.accentsSetter();
    return isAutoApplyEnable() ? icons() : infoMessage();
  });
  Commands.registerCommand('materialTheme.fixIcons', () => icons());
  Commands.registerCommand('materialTheme.toggleApplyIcons', () => ThemeCommands.toggleApplyIcons());
  Commands.registerCommand('materialTheme.showChangelog', () => showChangelog());
}
