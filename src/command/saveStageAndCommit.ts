import * as vscode from 'vscode';
import { execAsync } from "../util/childProcess";
import { findGitRepositoryByFilePath } from "../util/git";
import { saveAndStage } from './saveAndStage';

export async function saveStageAndCommit(): Promise<boolean> {
	const filePath = vscode.window.activeTextEditor?.document.fileName;
	if (!filePath) {
		return false;
	}

	const folderPath = await findGitRepositoryByFilePath(filePath);
	// const folderPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

	await execAsync(`git reset`, { cwd: folderPath });
	await saveAndStage();

	try {
		const wipMessage = '[WIP-COMMITER]';
		await execAsync(`git commit -m "${wipMessage}" --no-verify`, { cwd: folderPath });
	} catch {
		return false;
	}

	return true;
}
