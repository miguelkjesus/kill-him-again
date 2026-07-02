import { Workspace } from '@rbxts/services'
import { Maid } from 'shared/modules/maid'
import { Service } from 'shared/modules/service'
import { Services } from 'shared/modules/service-registry'

import { ICameraMode } from './camera-mode'
import { ICameraModifier } from './camera-modifier'

@Services.Declare
export class CameraService extends Service {
	private _modes: ICameraMode[] = []
	private _modifiers: ICameraModifier[] = []

	private _Maid = new Maid()
	private _Camera = Workspace.CurrentCamera

	protected OnStart() {
		this.InitCamera()
		this._Maid.Add(
			Workspace.GetPropertyChangedSignal('CurrentCamera').Connect(() => {
				this._Camera = Workspace.CurrentCamera
				this.InitCamera()
			}),
		)
	}

	protected OnPreRender() {
		if (this._Camera === undefined) return

		// Run modes and modifiers
	}

	private InitCamera() {
		if (this._Camera === undefined) return

		this._Camera.CameraType = Enum.CameraType.Scriptable

		this._Camera.GetPropertyChangedSignal('CameraType').Connect(() => {
			if (this._Camera === undefined) return
			if (this._Camera.CameraType === Enum.CameraType.Scriptable) return

			this._Camera.CameraType = Enum.CameraType.Scriptable
		})
	}

	GetModeStack(): readonly ICameraMode[] {
		return this._modes
	}

	GetCurrentMode() {
		return this._modes[this._modes.size() - 1]
	}

	Push(mode: ICameraMode) {
		this._modes.push(mode)
	}

	Pop(mode: ICameraMode) {
		this._modes.remove(this._modes.findIndex((m) => m === mode))
	}

	GetModifiers(): readonly ICameraModifier[] {
		return this._modifiers
	}

	AddModifier(modifier: ICameraModifier) {
		this._modifiers.push(modifier)
	}

	RemoveModifier(modifier: ICameraModifier) {
		this._modifiers.remove(this._modifiers.findIndex((m) => m === modifier))
	}
}
