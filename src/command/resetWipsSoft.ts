import config from '../config';
import { GitWrapper } from '../gitWrapper';
import { execAsync } from "../util/childProcess";
import { findGitRepositoryByFilePath } from "../util/git";
import { IDEActions, VscodeActions } from '../util/ideActions';

export async function resetWipsSoft(actions?: IDEActions) {
  if (!actions) {
		actions = new VscodeActions();
	}

  const filePath = await actions.getActiveFilePath();
  if (!filePath) {
    return false;
  }

  const folderPath = await findGitRepositoryByFilePath(filePath);
	const git = new GitWrapper(folderPath);

  const { stdout } = await execAsync('git log --oneline -n 1000', { cwd: folderPath });

  const commits = stdout.split('\n')
    .map((line) => {
      const [hash, ...msgChunks] = line.split(' ');
      const msg = msgChunks.join(' ');
      return { hash, msg };
    });

  const nonWipCommit = commits.find(({ msg }) => msg.trim() !== config.wipMessage);
  const firstCommit = commits.at(-1);

  if (nonWipCommit) {
    await git.reset({ ref: nonWipCommit.hash, soft: true });
  } else if (firstCommit) {
    await git.reset({ ref: firstCommit.hash, soft: true });
  }
}