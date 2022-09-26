import { GitWrapper } from '../gitWrapper';
import { findGitRepositoryByFilePath } from "../util/git";
import config from '../config';
import { IDEActions, VscodeActions } from '../util/ideActions';

export async function commitStaged(actions?: IDEActions) {
	if (!actions) {
		actions = new VscodeActions();
	}

	const filePath = await actions.getActiveFilePath();
	if (!filePath) {
		return;
	}

	const folderPath = await findGitRepositoryByFilePath(filePath);
	const git = new GitWrapper(folderPath);

	await git.commit(config.wipMessage, { noVerify: true });
}