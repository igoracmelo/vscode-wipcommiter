import * as vscode from 'vscode';
import { commitStaged } from './command/commitStaged';
import { resetWipsSoft } from './command/resetWipsSoft';
import { saveAndStage } from './command/saveAndStage';
import { saveStageAndCommit } from './command/saveStageAndCommit';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('wipcommiter.saveStageAndCommit', saveStageAndCommit);
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('wipcommiter.saveAndStage', saveAndStage);
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('wipcommiter.commitStaged', commitStaged);
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('wipcommiter.resetWipsSoft', resetWipsSoft);
	context.subscriptions.push(disposable);
}

export function deactivate() {}
