#!/usr/bin/env zx

import json5 from 'json5'
import path from 'path'
import { $, chalk, fs } from 'zx'

function getServiceDirectories(project) {
	return [
		{
			typeFilePath: 'types/ServerScriptService.d.ts',
			outDirectory: project.tree.ServerScriptService.TS.$path,
		},
		{
			typeFilePath: 'types/ReplicatedStorage.d.ts',
			outDirectory: project.tree.ReplicatedStorage.TS.$path,
		},
		{
			typeFilePath: 'types/ReplicatedFirst.d.ts',
			outDirectory: project.tree.ReplicatedFirst.TS.$path,
		},
		{
			typeFilePath: 'types/StarterPlayer.d.ts',
			outDirectory: project.tree.StarterPlayer.StarterPlayerScripts.TS.$path,
		},
	]
}

async function getChangedAndModifiedPaths() {
	// -z: NULL-separated, robust against spaces/unicode/quoting in filenames
	const out = (await $`git diff --cached --name-status -z`).stdout
	const parts = out.split('\0').filter(Boolean)

	const changes = []
	const modifications = []

	for (let i = 0; i < parts.length; i++) {
		const status = parts[i]
		if (status.startsWith('M')) {
			modifications.push(parts[++i])
		} else if (status.startsWith('R') || status.startsWith('C')) {
			// for rename/copy: emit TWO path fields, the old path and new path
			changes.push(parts[++i], parts[++i])
		} else {
			changes.push(parts[++i])
		}
	}

	return [changes, modifications]
}

function extractServiceDirectories(tsconfig, serviceDirectories, paths) {
	const srcDir = tsconfig.compilerOptions.rootDir
	const outDir = tsconfig.compilerOptions.outDir

	const dirs = new Set()

	for (const p of paths) {
		const normalizedPath = path.relative(srcDir, p)
		const serviceFolder = path.join(outDir, normalizedPath.split(path.sep)[0])

		const dir = serviceDirectories.find((d) => d.outDirectory === serviceFolder)
		if (dir) dirs.add(dir)
	}

	return Array.from(dirs)
}

function extractTypePaths(serviceDirectories, paths) {
	return paths.filter((p) => serviceDirectories.some((d) => d.typeFilePath === p))
}

function getTypePathsWhichNeedUpdate(changedServiceDirectories, changedTypePaths) {
	return changedServiceDirectories
		.map((dir) => dir.typeFilePath)
		.filter((typePath) => !changedTypePaths.includes(typePath))
}

void (async () => {
	const project = json5.parse(await fs.readFile('default.project.json', 'utf8'))
	const tsconfig = json5.parse(await fs.readFile('tsconfig.json', 'utf8'))

	const serviceDirectories = getServiceDirectories(project)

	const [changedPaths, modifiedPaths] = await getChangedAndModifiedPaths()
	const changedServiceDirectories = extractServiceDirectories(tsconfig, serviceDirectories, changedPaths)
	const changedTypePaths = extractTypePaths(serviceDirectories, modifiedPaths)

	const needsUpdate = getTypePathsWhichNeedUpdate(changedServiceDirectories, changedTypePaths)

	if (!needsUpdate.length) {
		console.log(chalk.green('All service type files are up to date.'))
		return
	}

	console.error(
		chalk.red(
			`Error: The following service type files need to be updated due to changes in their corresponding service directories:\n${chalk.red(needsUpdate.map((p) => `- ${p}`).join('\n'))}`,
		),
	)

	process.exitCode = 1
})()
