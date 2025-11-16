import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// We'll mock child_process before importing the module under test in tests that need it.

describe('detectPackageManager', () => {
  const originalEnv = { ...process.env };
  let tmpDir = '';

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mpi-'));
    process.env = { ...originalEnv };
    // ensure test isolation for package-manager related env vars
    delete process.env.npm_config_user_agent;
    delete process.env.npm_execpath;
  });

  afterEach(() => {
    // cleanup
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {}
    process.env = { ...originalEnv };
  });

  it('detects from npm_config_user_agent (pnpm)', async () => {
    process.env.npm_config_user_agent = 'pnpm/8.0.0'
    const { detectPackageManager } = await import('../src/pm');
    expect(detectPackageManager(tmpDir)).toBe('pnpm');
  });

  it('detects from npm_execpath (yarn)', async () => {
    process.env.npm_execpath = '/usr/local/bin/yarn'
    const { detectPackageManager } = await import('../src/pm');
    expect(detectPackageManager(tmpDir)).toBe('yarn');
  });

  it('detects from package.json packageManager field', async () => {
    const pj = { name: 'tmp', version: '1.0.0', packageManager: 'npm@9.0.0' };
    fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pj));
    const { detectPackageManager } = await import('../src/pm');
    expect(detectPackageManager(tmpDir)).toBe('npm');
  });

  it('detects from lockfile (pnpm-lock.yaml)', async () => {
    fs.writeFileSync(path.join(tmpDir, 'pnpm-lock.yaml'), 'lockfile');
    const { detectPackageManager } = await import('../src/pm');
    expect(detectPackageManager(tmpDir)).toBe('pnpm');
  });
});


describe('runPackageManagerAdd', () => {
  const originalEnv = { ...process.env };
  let spawnMock: any;
  let tmpDir = '';

  beforeEach(() => {
    process.env = { ...originalEnv };
    // reset module cache so that our vi.mock can take effect
    vi.resetModules();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mpi-run-'));
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
    try {
      if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {}
  });

  it('runs pnpm add and resolves on exit 0', async () => {
    // mock child_process.spawn
    spawnMock = vi.fn(() => {
      return {
        on: (ev: string, cb: any) => {
          if (ev === 'exit') setImmediate(() => cb(0));
        }
      };
    });

    vi.doMock('child_process', () => ({
      spawn: spawnMock,
      spawnSync: vi.fn()
    }));

    const logger = { info: vi.fn() };
    const { runPackageManagerAdd } = await import('../src/pm');

    const tempFile = path.join(tmpDir, 'package.tgz');
    // ensure file exists for path operations
    fs.writeFileSync(tempFile, 'x');

    await expect(runPackageManagerAdd('pnpm', tempFile, logger)).resolves.toBe(0);
    expect(spawnMock).toHaveBeenCalled();
  });

  it('rejects when command exits non-zero', async () => {
    spawnMock = vi.fn(() => {
      return {
        on: (ev: string, cb: any) => {
          if (ev === 'exit') setImmediate(() => cb(2));
        }
      };
    });

    vi.doMock('child_process', () => ({
      spawn: spawnMock,
      spawnSync: vi.fn()
    }));

    const logger = { info: vi.fn() };
    const { runPackageManagerAdd } = await import('../src/pm');

    const tempFile = path.join(tmpDir, 'package.tgz');
    fs.writeFileSync(tempFile, 'x');

    await expect(runPackageManagerAdd('npm', tempFile, logger)).rejects.toThrow();
    expect(spawnMock).toHaveBeenCalled();
  });
});
