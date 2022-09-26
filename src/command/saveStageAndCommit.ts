import config from '../config';
import { GitWrapper } from '../gitWrapper';
import { findGitRepositoryByFilePath } from "../util/git";
import { IDEActions, VscodeActions } from '../util/ideActions';
import { saveAndStage } from './saveAndStage';

export async function saveStageAndCommit(actions?: IDEActions): Promise<boolean> {
  if (!actions) {
		actions = new VscodeActions();
	}

	const filePath = await actions.getActiveFilePath();
	if (!filePath) {
		return false;
	}

	const folderPath = await findGitRepositoryByFilePath(filePath);
	const git = new GitWrapper(folderPath);

	await git.reset();
	await saveAndStage();

	try {
		await git.commit(config.wipMessage, { noVerify: true });
	} catch {
		return false;
	}

	return true;
}
