interface ReplicatedStorage extends Instance {
	TS: Folder & {
		modules: Folder & {
			["service-registry"]: ModuleScript;
			["script-loader"]: ModuleScript;
			service: ModuleScript;
			maid: ModuleScript;
			signal: ModuleScript;
		};
		services: Folder;
	};
	rbxts_include: Folder & {
		RuntimeLib: ModuleScript;
		Promise: ModuleScript;
		node_modules: Folder & {
			["@rbxts"]: Folder & {
				types: Folder & {
					include: Folder & {
						generated: Folder;
					};
				};
				["compiler-types"]: Folder & {
					types: Folder;
				};
				services: ModuleScript;
			};
		};
	};
}
