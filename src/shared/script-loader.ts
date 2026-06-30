export interface ScriptLoader {
	FromInstances(instances: Instance[]): void
	LoadChildrenOf(parent: Instance): void
	LoadDescendantsOf(parent: Instance): void
}

const scriptLoaderImpl: ScriptLoader = {
	FromInstances(instances: Instance[]) {
		for (const instance of instances) {
			if (instance.IsA('ModuleScript')) {
				task.spawn(() => require(instance))
			}
		}
	},

	LoadChildrenOf(parent: Instance) {
		this.FromInstances(parent.GetChildren())
	},

	LoadDescendantsOf(parent: Instance) {
		this.FromInstances(parent.GetDescendants())
	},
}

export const ScriptLoader: ScriptLoader = scriptLoaderImpl
