import * as vscode from 'vscode';
import { execAsync } from "../util/childProcess";
import { findGitRepositoryByFilePath } from "../util/git";

export async function resetWipsSoft() {
  const filePath = vscode.window.activeTextEditor?.document.fileName;
  if (!filePath) {
    return false;
  }

  const folderPath = await findGitRepositoryByFilePath(filePath);

  const { stdout } = await execAsync('git log --oneline -n 1000', { cwd: folderPath });

  const commits = stdout.split('\n')
    .map((line) => {
      const [hash, ...msgChunks] = line.split(' ');
      const msg = msgChunks.join(' ');
      return { hash, msg };
    });

  const wipMessage = '[WIP-COMMITER]';
  const nonWipCommit = commits.find(({ msg }) => msg.trim() !== wipMessage);
  const firstCommit = commits.at(-1);

  if (nonWipCommit) {
    await execAsync(`git reset --soft ${nonWipCommit.hash}`, { cwd: folderPath });
  } else if (firstCommit) {
    await execAsync(`git reset --soft ${firstCommit.hash}`, { cwd: folderPath });
  }
}