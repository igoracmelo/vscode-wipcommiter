import * as vscode from 'vscode';
import { execAsync } from "../util/childProcess";
import { findGitRepositoryByFilePath } from '../util/git';

export async function saveAndStage() {
  const filePath = vscode.window.activeTextEditor?.document.fileName;
	if (!filePath) {
		return false;
	}

	const folderPath = await findGitRepositoryByFilePath(filePath);

  await vscode.commands.executeCommand('workbench.action.files.save');
	const { stdout } = await execAsync(`git status -s`, { cwd: folderPath });

	if (!stdout.trim()) {
		return false;
	}

	const { stderr } = await execAsync(`git add "${filePath}"`, { cwd: folderPath });
	if (stderr.trim()) {
		return false;
	}
}