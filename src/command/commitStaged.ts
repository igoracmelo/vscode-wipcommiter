import * as vscode from 'vscode';
import { execAsync } from "../util/childProcess";
import { findGitRepositoryByFilePath } from "../util/git";

export async function commitStaged() {
	const filePath = vscode.window.activeTextEditor?.document.fileName;
	if (!filePath) {
		return;
	}

	const folderPath = await findGitRepositoryByFilePath(filePath);

  const wipMessage = '[WIP-COMMITER]';

	// await vscode.commands.executeCommand('workbench.action.files.save');
	await execAsync(`git commit -m "${wipMessage}" --no-verify`, { cwd: folderPath });
}