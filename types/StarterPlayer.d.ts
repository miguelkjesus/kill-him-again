interface StarterPlayer extends Instance {
	StarterCharacterScripts: StarterCharacterScripts;
	StarterPlayerScripts: StarterPlayerScripts & {
		PlayerScriptsLoader: LocalScript;
		PlayerModule: ModuleScript & {
			CommonUtils: Folder & {
				CameraWrapper: ModuleScript;
				CharacterUtil: ModuleScript;
				["ConnectionUtil.spec"]: ModuleScript;
				ConnectionUtil: ModuleScript;
				["CameraWrapper.spec"]: ModuleScript;
				FlagUtil: ModuleScript;
			};
			ControlModule: ModuleScript & {
				TouchJump: ModuleScript;
				Keyboard: ModuleScript;
				ClickToMoveDisplay: ModuleScript;
				VehicleController: ModuleScript;
				DynamicThumbstick: ModuleScript;
				TouchThumbstick: ModuleScript;
				ClickToMoveController: ModuleScript;
				VRNavigation: ModuleScript;
				PathDisplay: ModuleScript;
				Gamepad: ModuleScript;
				AvatarAbilitiesInterface: ModuleScript;
				BaseCharacterController: ModuleScript;
			};
			CameraModule: ModuleScript & {
				CameraUtils: ModuleScript;
				Invisicam: ModuleScript;
				VehicleCamera: ModuleScript & {
					VehicleCameraConfig: ModuleScript;
					VehicleCameraCore: ModuleScript;
				};
				BaseCamera: ModuleScript;
				VRVehicleCamera: ModuleScript;
				CameraToggleStateController: ModuleScript;
				CameraUI: ModuleScript;
				LegacyCamera: ModuleScript;
				Poppercam: ModuleScript;
				ClassicCamera: ModuleScript;
				MouseLockController: ModuleScript;
				VRBaseCamera: ModuleScript;
				CameraInput: ModuleScript;
				BaseOcclusion: ModuleScript;
				ZoomController: ModuleScript & {
					Popper: ModuleScript;
				};
				OrbitalCamera: ModuleScript;
				TransparencyController: ModuleScript;
				VRCamera: ModuleScript;
			};
		};
		TS: Folder & {
			main: LocalScript;
			services: Folder & {
				["init-service"]: ModuleScript;
				camera: ModuleScript & {
					["camera-service"]: ModuleScript;
					modifiers: Folder;
					["camera-state"]: ModuleScript;
					modes: ModuleScript & {
						["free-camera-mode"]: ModuleScript;
					};
					["camera-mode"]: ModuleScript;
					["camera-modifier"]: ModuleScript;
				};
			};
		};
		RbxCharacterSounds: LocalScript & {
			AtomicBinding: ModuleScript;
		};
	};
}
