import {
  workspace as Workspace,
  commands as Commands
} from 'vscode';

import * as ThemeCommands from './commands';
import {shouldShowChangelog, showChangelog} from './helpers/changelog';
import {reloadWindow, getCurrentThemeID} from './helpers/vscode';
import {isMaterialTheme} from './helpers/settings';

export function activate() {
  const config = Workspace.getConfiguration();

  // Listen on set theme: when the theme is Material Theme, just adjust icon and accent.
  Workspace.onDidChangeConfiguration(event => {
    const isColorTheme = event.affectsConfiguration('workbench.colorTheme');
    const currentTheme = getCurrentThemeID();
    // tslint:disable-next-line:early-exit
    if (isColorTheme && isMaterialTheme(currentTheme)) {
      // TODO: check for `autoFix` flag
      ThemeCommands.fixIcons()
        .then(() => reloadWindow())
        .catch((error: NodeJS.ErrnoException) => console.trace(error));
    }
  });

  // Delete old configuration, must remove with next major release
  if (config.has('materialTheme.cache.workbench')) {
    config.update('materialTheme.cache.workbench', undefined, true);
  }

  if (shouldShowChangelog()) {
    showChangelog();
  }

  // Registering commands
  Commands.registerCommand('materialTheme.setAccent', () =>
    ThemeCommands.accentsSetter()
      // TODO: check for `autoFix` flag
      .then(() => ThemeCommands.fixIcons())
      .then(() => reloadWindow())
      .catch((err: NodeJS.ErrnoException) => console.trace(err))
  );
  Commands.registerCommand('materialTheme.fixIcons', () =>
    ThemeCommands.fixIcons()
      .then(() => reloadWindow())
      .catch((err: NodeJS.ErrnoException) => console.trace(err))
  );
  Commands.registerCommand('materialTheme.showChangelog', () => showChangelog());
}
