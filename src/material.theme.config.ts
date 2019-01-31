import {
  workspace as Workspace,
  commands as Commands,
  ExtensionContext
} from 'vscode';

import * as ThemeCommands from './commands';
import {updateAccent} from './helpers/settings';
import {changelogMessage} from './helpers/messages';
import checkInstallation from './helpers/check-installation';
import writeChangelog from './helpers/write-changelog';
import {ReleaseNotesWebview} from './webviews/ReleaseNotes';

export async function activate(context: ExtensionContext) {
  const config = Workspace.getConfiguration();
  const installationType = checkInstallation();
  const releaseNotesView = new ReleaseNotesWebview(context);

  writeChangelog();

  // Delete old configuration, must remove with next major release
  if (config.has('materialTheme.cache.workbench')) {
    config.update('materialTheme.cache.workbench', undefined, true);
  }

  if (installationType.isFirstInstall) {
    // TODO
    // const enableAutoApply = await installationMessage();
  }

  const shouldShowChangelog = (installationType.isFirstInstall || installationType.isUpdate) && await changelogMessage();
  if (shouldShowChangelog) {
    releaseNotesView.show();
  }

  // Registering commands
  Commands.registerCommand('materialTheme.setAccent', async () => {
    const accentPicked = await ThemeCommands.accentsQuickPick();
    await updateAccent(accentPicked);
  });

  Commands.registerCommand('materialTheme.showReleaseNotes', () => releaseNotesView.show());
}
