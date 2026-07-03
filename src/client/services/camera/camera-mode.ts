import { CameraState } from './camera-state'

export abstract class CameraMode {
	protected OnActivate?(): void

	protected OnDeactivate?(): void

	protected abstract OnUpdate(deltaTime: number, previous: CameraState): CameraState

	Activate() {
		this.OnActivate?.()
	}

	Deactivate() {
		this.OnDeactivate?.()
	}

	Update(deltaTime: number, previous: CameraState) {
		return this.OnUpdate(deltaTime, previous)
	}
}
