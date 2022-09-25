import * as childProcess from 'child_process';

export const execAsync = (
	command: string,
	options?: { cwd?: string }
): Promise<{ stdout: string; stderr: string; }> => {
	return new Promise((resolve, reject) => {
		childProcess.exec(command, { cwd: options?.cwd }, (err, stdout, stderr) => {
			if (err) {
				reject(err);
			}

			resolve({ stdout, stderr });
		});
	});
};
