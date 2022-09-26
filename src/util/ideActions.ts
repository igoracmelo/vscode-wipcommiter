import * as vscode from 'vscode';

export interface IDEActions {
	getActiveFilePath: () => Promise<string | undefined>;
	saveActiveFile: () => Promise<void>;
	showInfo: (message: string) => Promise<void>;
}

export class VscodeActions implements IDEActions {
	async getActiveFilePath () {
		return vscode.window.activeTextEditor?.document.fileName;
	}
	async saveActiveFile () {
		await vscode.commands.executeCommand('workbench.action.files.save');
	}

	async showInfo (message: string) {
		vscode.window.showInformationMessage(message);
	}
}
