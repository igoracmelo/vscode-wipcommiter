import { execAsync } from "./util/childProcess";

export type GitStatus = {
  untracked: string[],
  unstaged: string[],
  staged: string[],
};

export type CommitOptions = {
  noVerify: boolean
};

export type ResetOptions = {
  ref?: string
  soft?: boolean
};

export interface IGitWrapper {
  directory: string;
  init: () => Promise<void>;
  add: (...paths: string[]) => Promise<void>;
  status: (...paths: string[]) => Promise<GitStatus>;
  commit: (message: string) => Promise<void>;
  reset: (options?: ResetOptions) => Promise<void>;
}

export class GitWrapper implements IGitWrapper {
  directory: string;

  constructor(directory: string) {
    this.directory = directory;
  }

  async init() {
    await execAsync('git init', { cwd: this.directory });
  }

  async add(...paths: string[]) {
    const pathsFormatted = paths.map(path => `'${path}'`).join(' ');
    await execAsync(`git add ${pathsFormatted}`, { cwd: this.directory });
  }

  async status(...paths: string[]): Promise<GitStatus> {
    const untracked: string[] = [];
    const unstaged: string[] = [];
    const staged: string[] = [];

    const filePaths = paths.map(path => `'${path}'`).join(' ');
    let command = 'git status --porcelain';

    if (filePaths) {
      command += ' ' + filePaths;
    }

    const { stdout } = await execAsync(command, { cwd: this.directory });

    for (const line of stdout.split('\n')) {
      if (!line.trim()) {
        continue;
      }

      if (line.startsWith('??')) {
        const filePath = line.split('?? ')[1];
        untracked.push(filePath);
      } else {
        if (line[0] !== ' ') {
          const filePath = line.split(/\s+/)[1];
          staged.push(filePath);
        }

        if (line[1] !== ' ') {
          const filePath = line.split(/\s+/)[1];
          unstaged.push(filePath);
        }
      }
    }

    return {
      untracked,
      unstaged,
      staged,
    };
  }

  async commit(message: string, options?: CommitOptions): Promise<void> {
    let command = `git commit -m '${message}'`;

    if (options?.noVerify) {
      command += ' --no-verify';
    }

    await execAsync(command, { cwd: this.directory });
  }

  async reset(options?: ResetOptions): Promise<void> {

    let command = 'git reset';
    if (options?.ref) {
      command += ` ${options?.ref}`;
    }

    if (options?.soft) {
      command += ' --soft';
    }

    await execAsync(command, { cwd: this.directory });
  }
}
