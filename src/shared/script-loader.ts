interface ScriptLoader {
	FromInstances(instances: Instance[]): void
	LoadChildrenOf(parent: Instance): void
	LoadDescendantsOf(parent: Instance): void
}

const scriptLoaderImpl: ScriptLoader = {
	FromInstances(instances: Instance[]) {
		for (const instance of instances) {
			if (instance.IsA('ModuleScript')) require(instance)
		}
	},

	LoadChildrenOf(parent: Instance) {
		this.FromInstances(parent.GetChildren())
	},

	LoadDescendantsOf(parent: Instance) {
		this.FromInstances(parent.GetDescendants())
	},
}

const ScriptLoader: ScriptLoader = scriptLoaderImpl

export default ScriptLoader
