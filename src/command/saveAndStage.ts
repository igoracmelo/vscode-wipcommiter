import { GitWrapper } from '../gitWrapper';
import { findGitRepositoryByFilePath } from '../util/git';
import { IDEActions, VscodeActions } from '../util/ideActions';

export async function saveAndStage(actions?: IDEActions) {
  if (!actions) {
		actions = new VscodeActions();
	}

  const filePath = await actions.getActiveFilePath();
	if (!filePath) {
		return false;
	}

	const folderPath = await findGitRepositoryByFilePath(filePath);
	const git = new GitWrapper(folderPath);

  await actions.saveActiveFile();
	const status = await git.status(filePath);

	if (!status.untracked.length && !status.unstaged.length) {
		actions.showInfo('This file has no changes to be staged');
		return false;
	}

	await git.add(filePath);
}