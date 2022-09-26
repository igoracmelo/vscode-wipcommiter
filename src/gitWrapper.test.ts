import assert = require("assert");
import * as fs from "fs/promises";
import * as os from "os";
import { afterEach, beforeEach, suite, test } from "mocha";
import path = require("path");
import { GitWrapper, IGitWrapper } from "./gitWrapper";

let tempDir = '';

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wipcommiter-test-'));
  // console.log('created', tempDir);
});

afterEach(async () => {
  await fs.rm(tempDir, { recursive: true });
  // console.log('removed', tempDir);
});

test('status should be empty on new repo', async () => {
  const git: IGitWrapper = new GitWrapper(tempDir);

  await git.init();
  const status = await git.status();

  assert.deepEqual(status, {
    untracked: [],
    unstaged: [],
    staged: [],
  });
});

test('status of a single file', async () => {
  await fs.writeFile(path.join(tempDir, 'file1.txt'), 'some content', 'utf-8');
  await fs.writeFile(path.join(tempDir, 'file2.txt'), 'some content', 'utf-8');

  const git: IGitWrapper = new GitWrapper(tempDir);

  await git.init();
  const status = await git.status('file1.txt');

  assert.deepEqual(status, {
    untracked: ['file1.txt'],
    unstaged: [],
    staged: [],
  });
});

test('should have two untracked files after creating two files', async () => {
  await fs.writeFile(path.join(tempDir, 'file1.txt'), 'some content', 'utf-8');
  await fs.writeFile(path.join(tempDir, 'file2.txt'), 'some content', 'utf-8');

  const git: IGitWrapper = new GitWrapper(tempDir);

  await git.init();
  const status = await git.status();

  assert.equal(status.untracked.length, 2);
});

test('status should have one untracked and one staged file after creating two files and adding one file', async () => {
  await fs.writeFile(path.join(tempDir, 'file1.txt'), 'some content', 'utf-8');
  await fs.writeFile(path.join(tempDir, 'file2.txt'), 'some content', 'utf-8');

  const git: IGitWrapper = new GitWrapper(tempDir);

  await git.init();
  await git.add('file1.txt');
  const status = await git.status();

  assert.equal(status.untracked.length, 1);
  assert.equal(status.staged.length, 1);
});

test('should have no untracked files after commiting', async () => {
  await fs.writeFile(path.join(tempDir, 'file1.txt'), 'some content', 'utf-8');

  const git: IGitWrapper = new GitWrapper(tempDir);

  await git.init();

  let status = await git.status();
  assert.equal(status.untracked.length, 1);

  await git.add('file1.txt');
  await git.commit('hello world');

  status = await git.status();
  assert.equal(status.untracked.length, 0);
});

test('should have unstaged changes after commiting and editting', async () => {
  await fs.writeFile(path.join(tempDir, 'file1.txt'), 'some content', 'utf-8');

  const git: IGitWrapper = new GitWrapper(tempDir);

  await git.init();

  let status = await git.status();
  assert.equal(status.untracked.length, 1);

  await git.add('file1.txt');
  await git.commit('hello world');
  await fs.writeFile(path.join(tempDir, 'file1.txt'), 'some other content', 'utf-8');

  status = await git.status();
  assert.equal(status.unstaged.length, 1);
});

test('status should have one untracked and one staged file after creating two files and adding one file', async () => {
  await fs.writeFile(path.join(tempDir, 'file1.txt'), 'some content', 'utf-8');
  await fs.writeFile(path.join(tempDir, 'file2.txt'), 'some content', 'utf-8');

  const git: IGitWrapper = new GitWrapper(tempDir);

  await git.init();
  await git.add('file1.txt', 'file2.txt');
  const status = await git.status();

  assert.equal(status.untracked.length, 0);
  assert.equal(status.staged.length, 2);
});

test('should reset staged', async () => {
  await fs.writeFile(path.join(tempDir, 'file1.txt'), 'some content', 'utf-8');
  await fs.writeFile(path.join(tempDir, 'file2.txt'), 'some content', 'utf-8');

  const git: IGitWrapper = new GitWrapper(tempDir);

  await git.init();
  await git.add('file1.txt');

  let status = await git.status();
  assert.equal(status.staged.length, 1);

  await git.reset();

  status = await git.status();
  assert.equal(status.staged.length, 0);
});

test('should soft reset last commit', async () => {
  await fs.writeFile(path.join(tempDir, 'file1.txt'), 'some content', 'utf-8');
  await fs.writeFile(path.join(tempDir, 'file2.txt'), 'some content', 'utf-8');

  const git: IGitWrapper = new GitWrapper(tempDir);

  await git.init();

  await git.add('file1.txt');
  await git.commit('first commit');
  await git.add('file2.txt');
  await git.commit('first commit');

  let status = await git.status();
  assert.equal(status.staged.length, 0);

  await git.reset({ ref: '@~', soft: true });

  status = await git.status();
  assert.equal(status.staged.length, 1);
});
