interface ReplicatedStorage extends Instance {
	DungeonRooms: Folder & {
		Room: Model & {
			NextOrigin: Attachment;
			RoomBox: Part;
			Base: Part;
		};
		Spawn: Model & {
			NextOrigin: Attachment;
			RoomBox: Part;
			Base: Part;
		};
	};
	TS: Folder & {
		modules: Folder & {
			["service-registry"]: ModuleScript;
			["script-loader"]: ModuleScript;
			service: ModuleScript;
			maid: ModuleScript;
			signal: ModuleScript;
		};
		services: Folder & {
			bar: ModuleScript;
		};
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
