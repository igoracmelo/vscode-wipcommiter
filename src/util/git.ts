import path = require('path');
import { execAsync } from "./childProcess";

const findGitRepositoryByFolder = async (folderPath: string): Promise<string> => {
	try {
		await execAsync(`git status`, { cwd: folderPath });
		return folderPath;
	} catch {
		const newPath = path.resolve(folderPath, '..');
		if (newPath === folderPath) {
			throw new Error('No git repository found');
		}
		return findGitRepositoryByFolder(newPath);
	}
};

export const findGitRepositoryByFilePath = async (filePath: string): Promise<string> => {
	let fileFolder = path.dirname(filePath);
	return findGitRepositoryByFolder(fileFolder);
};
