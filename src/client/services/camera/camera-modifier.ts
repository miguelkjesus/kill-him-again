import { CameraState } from './camera-state'

export abstract class CameraModifier {
	private __Enabled = true

	protected abstract OnUpdate(deltaTime: number, current: CameraState): CameraState

	protected OnDestroy?(): void

	IsEnabled() {
		return this.__Enabled
	}

	SetEnabled(enabled: boolean) {
		this.__Enabled = enabled
	}

	IsFinished() {
		return false
	}

	Update(deltaTime: number, current: CameraState) {
		return this.OnUpdate(deltaTime, current)
	}

	Destroy() {
		this.OnDestroy?.()
	}
}
