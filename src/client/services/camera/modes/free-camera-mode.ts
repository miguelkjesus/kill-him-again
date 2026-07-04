import { UserInputService } from '@rbxts/services'
import { Maid } from 'shared/modules/maid'

import { CameraMode } from '../camera-mode'
import { CameraState } from '../camera-state'

export class FreeCameraMode extends CameraMode {
	private readonly _Maid = new Maid()

	private readonly _cameraSensitivity = 0.004
	private readonly _pitchLimit = math.rad(85)
	private readonly _moveSpeed = 50

	private _lookingAround = false
	private _move = { X: 0, Y: 0, Z: 0 }
	private readonly _heldKeys = new Set<Enum.KeyCode>()

	protected OnActivate(): void {
		UserInputService.MouseBehavior = Enum.MouseBehavior.Default

		this._Maid.Add(
			UserInputService.InputBegan.Connect((input, processed) => {
				if (processed) return

				if (input.UserInputType === Enum.UserInputType.MouseButton2) {
					UserInputService.MouseBehavior = Enum.MouseBehavior.LockCurrentPosition
					this._lookingAround = true
				}

				if (input.UserInputType === Enum.UserInputType.Keyboard && !this._heldKeys.has(input.KeyCode)) {
					this._heldKeys.add(input.KeyCode)
					this.ApplyMoveKey(input.KeyCode, 1)
				}
			}),
		)

		this._Maid.Add(
			UserInputService.InputEnded.Connect((input) => {
				if (input.UserInputType === Enum.UserInputType.MouseButton2) {
					UserInputService.MouseBehavior = Enum.MouseBehavior.Default
					this._lookingAround = false
				}

				if (input.UserInputType === Enum.UserInputType.Keyboard && this._heldKeys.has(input.KeyCode)) {
					this._heldKeys.delete(input.KeyCode)
					this.ApplyMoveKey(input.KeyCode, -1)
				}
			}),
		)
	}

	protected OnDeactivate(): void {
		this._Maid.Clean()

		UserInputService.MouseBehavior = Enum.MouseBehavior.Default
		this._lookingAround = false
		this._heldKeys.clear()
		this._move = { X: 0, Y: 0, Z: 0 }
	}

	protected OnUpdate(dt: number, previous: CameraState) {
		const previousOrientation = previous.CFrame.ToOrientation()

		let nextCFrame = previous.CFrame

		// Movement

		const yaw = previousOrientation[1]

		if (this._move.X !== 0 || this._move.Y !== 0 || this._move.Z !== 0) {
			const direction = CFrame.Angles(0, yaw, 0).VectorToWorldSpace(
				new Vector3(this._move.X, this._move.Y, this._move.Z),
			)
			nextCFrame = nextCFrame.add(direction.Unit.mul(this._moveSpeed * dt))
		}

		// Orientation

		if (this._lookingAround) {
			const mouseDelta = UserInputService.GetMouseDelta()

			let [pitch, yaw] = previousOrientation

			yaw -= mouseDelta.X * this._cameraSensitivity
			pitch -= mouseDelta.Y * this._cameraSensitivity
			pitch = math.clamp(pitch, -this._pitchLimit, this._pitchLimit)

			nextCFrame = new CFrame(nextCFrame.Position).mul(CFrame.Angles(0, yaw, 0)).mul(CFrame.Angles(pitch, 0, 0))
		}

		return previous.With({
			CFrame: nextCFrame,
			Focus: nextCFrame,
		})
	}

	private ApplyMoveKey(keyCode: Enum.KeyCode, sign: number) {
		switch (keyCode) {
			case Enum.KeyCode.D:
				this._move.X += sign
				break
			case Enum.KeyCode.A:
				this._move.X -= sign
				break
			case Enum.KeyCode.E:
				this._move.Y += sign
				break
			case Enum.KeyCode.Q:
				this._move.Y -= sign
				break
			case Enum.KeyCode.S:
				this._move.Z += sign
				break
			case Enum.KeyCode.W:
				this._move.Z -= sign
				break
		}
	}
}
