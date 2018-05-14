import {
  workspace as Workspace,
  commands as Commands,
  ConfigurationChangeEvent
} from 'vscode';

import * as ThemeCommands from './commands';
import {shouldShowChangelog, showChangelog} from './helpers/changelog';
import {reloadWindow, getCurrentThemeID} from './helpers/vscode';
import {isMaterialTheme, isAutoApplyEnable} from './helpers/settings';

const onChangeConfiguration = (event: ConfigurationChangeEvent) => {
  const isColorTheme = event.affectsConfiguration('workbench.colorTheme');
  const currentTheme = getCurrentThemeID();
  if (!isMaterialTheme(currentTheme) || !isColorTheme) {
    return;
  }

  if (!isAutoApplyEnable()) {
    return;
  }

  ThemeCommands.fixIcons()
    .then(() => reloadWindow())
    .catch((error: NodeJS.ErrnoException) => console.trace(error));
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

    if (!isAutoApplyEnable()) {
      return;
    }

    ThemeCommands.fixIcons()
      .then(() => reloadWindow())
      .catch((err: NodeJS.ErrnoException) => console.trace(err));
  });
  Commands.registerCommand('materialTheme.fixIcons', () =>
    ThemeCommands.fixIcons()
      .then(() => reloadWindow())
      .catch((err: NodeJS.ErrnoException) => console.trace(err))
  );
  Commands.registerCommand('materialTheme.toggleApplyIcons', () => ThemeCommands.toggleApplyIcons());
  Commands.registerCommand('materialTheme.showChangelog', () => showChangelog());
}
