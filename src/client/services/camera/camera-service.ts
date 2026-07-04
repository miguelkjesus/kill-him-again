import { Workspace } from '@rbxts/services'
import { Maid } from 'shared/modules/maid'
import { Service } from 'shared/modules/service'
import { Services } from 'shared/modules/service-registry'

import { CameraMode } from './camera-mode'
import { CameraModifier } from './camera-modifier'
import { CameraState } from './camera-state'

@Services.Declare
export class CameraService extends Service {
	private readonly _Maid = new Maid()

	private readonly _Modes: CameraMode[] = []
	private readonly _Modifiers: CameraModifier[] = []

	private _Camera = Workspace.CurrentCamera
	private _LastModeState?: CameraState

	protected OnStart() {
		this.InitCamera()
		this._Maid.Add(
			Workspace.GetPropertyChangedSignal('CurrentCamera').Connect(() => {
				this._Camera = Workspace.CurrentCamera
				this.InitCamera()
			}),
		)
	}

	protected OnStop() {
		this._Maid.Clean()
	}

	protected OnPreRender(deltaTime: number) {
		const Camera = this._Camera
		if (Camera === undefined) return

		const Mode = this.GetCurrentMode()
		if (Mode === undefined) return

		const Previous = this._LastModeState ?? CameraState.fromCamera(Camera)
		let State = Mode.Update(deltaTime, Previous)
		this._LastModeState = State

		const Finished: CameraModifier[] = []
		for (const Modifier of this._Modifiers) {
			if (Modifier.IsEnabled()) State = State.Compose(Modifier.Update(deltaTime, State))
			if (Modifier.IsFinished()) Finished.push(Modifier)
		}

		if (!Finished.isEmpty()) {
			for (const Modifier of Finished) {
				this.RemoveModifier(Modifier)
				Modifier.Destroy()
			}
		}

		State.ApplyTo(Camera)
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

	GetModeStack(): readonly CameraMode[] {
		return this._Modes
	}

	GetCurrentMode(): CameraMode | undefined {
		return this._Modes[this._Modes.size() - 1]
	}

	Push(mode: CameraMode) {
		this.GetCurrentMode()?.Deactivate()
		this._Modes.push(mode)
		mode.Activate()
	}

	Pop(mode: CameraMode) {
		const Index = this._Modes.findIndex((m) => m === mode)
		if (Index === -1) return

		const WasTop = Index === this._Modes.size() - 1
		this._Modes.remove(Index)

		if (WasTop) {
			mode.Deactivate()
			this.GetCurrentMode()?.Activate()
		}
	}

	GetModifiers(): readonly CameraModifier[] {
		return this._Modifiers
	}

	AddModifier(modifier: CameraModifier) {
		this._Modifiers.push(modifier)
	}

	RemoveModifier(modifier: CameraModifier) {
		const Index = this._Modifiers.findIndex((m) => m === modifier)
		if (Index === -1) return

		this._Modifiers.remove(Index)
	}
}
