export interface CameraStateOptions {
	readonly CFrame: CFrame
	readonly FieldOfView: number
	readonly Focus: CFrame
}

export class CameraState {
	static readonly Identity = new CameraState({
		CFrame: CFrame.identity,
		FieldOfView: 0,
		Focus: CFrame.identity,
	})

	static fromCamera(camera: Camera) {
		return new this({
			CFrame: camera.CFrame,
			FieldOfView: camera.FieldOfView,
			Focus: camera.Focus,
		})
	}

	constructor(options: CameraStateOptions) {
		this.CFrame = options.CFrame
		this.FieldOfView = options.FieldOfView
		this.Focus = options.Focus
	}

	readonly CFrame: CFrame
	readonly FieldOfView: number
	readonly Focus: CFrame

	Compose(delta: CameraState) {
		return new CameraState({
			CFrame: this.CFrame.mul(delta.CFrame),
			FieldOfView: this.FieldOfView + delta.FieldOfView,
			Focus: this.Focus.mul(delta.Focus),
		})
	}

	Lerp(goal: CameraState, alpha: number) {
		return new CameraState({
			CFrame: this.CFrame.Lerp(goal.CFrame, alpha),
			FieldOfView: this.FieldOfView + (goal.FieldOfView - this.FieldOfView) * alpha,
			Focus: this.Focus.Lerp(goal.Focus, alpha),
		})
	}

	With(options: Partial<CameraStateOptions>) {
		return new CameraState({
			CFrame: options.CFrame ?? this.CFrame,
			FieldOfView: options.FieldOfView ?? this.FieldOfView,
			Focus: options.Focus ?? this.Focus,
		})
	}

	Clone() {
		return this.With({})
	}

	ApplyTo(camera: Camera) {
		camera.CFrame = this.CFrame
		camera.FieldOfView = this.FieldOfView
		camera.Focus = this.Focus
	}
}
