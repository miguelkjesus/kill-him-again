interface ServerScriptService extends Instance {
	TS: Folder & {
		main: Script;
		services: Folder & {
			["init-service"]: ModuleScript;
			["dungeon-generator-service"]: ModuleScript & {
				["dungeon-generator-service"]: ModuleScript;
			};
		};
	};
}
