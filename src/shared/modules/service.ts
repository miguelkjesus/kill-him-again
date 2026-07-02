import { RunService } from '@rbxts/services'

import { Maid } from './maid'
import { Signal } from './signal'

export abstract class Service {
	private _state: ServiceState = 'registering'
	private _maid = new Maid()

	private readonly StateChangedSignal = new Signal<[state: ServiceState]>()
	readonly StateChanged = this.StateChangedSignal.Event

	private readonly StartingSignal = new Signal<[]>()
	readonly Starting = this.StartingSignal.Event

	private readonly StartedSignal = new Signal<[]>()
	readonly Started = this.StartedSignal.Event

	private readonly StoppingSignal = new Signal<[]>()
	readonly Stopping = this.StoppingSignal.Event

	private readonly StoppedSignal = new Signal<[]>()
	readonly Stopped = this.StoppedSignal.Event

	protected OnRegister?(): void

	protected OnStart?(): void | Promise<void>

	protected OnPreRender?(): void | Promise<void>

	protected OnStop?(): void | Promise<void>

	private SetState(state: ServiceState) {
		this._state = state
		this.StateChangedSignal.Fire(state)

		switch (state) {
			case 'starting':
				this.StartingSignal.Fire()
				break
			case 'running':
				this.StartedSignal.Fire()
				break
			case 'stopping':
				this.StoppingSignal.Fire()
				break
			case 'stopped':
				this.StoppedSignal.Fire()
				break
		}
	}

	GetState() {
		return this._state
	}

	async Start() {
		this.OnRegister?.()
		this.SetState('starting')

		if ('OnStart' in this) {
			await Promise.try(() => this.OnStart!())
		}

		if (RunService.IsClient()) {
			if ('OnPreRender' in this) {
				this._maid.Add(RunService.PreRender.Connect(() => void Promise.try(() => this.OnPreRender!())))
			}
		}

		this.SetState('running')
	}

	async Stop() {
		this.SetState('stopping')

		if ('OnStop' in this) {
			await Promise.try(() => this.OnStop!())
		}

		this.SetState('stopped')
	}
}

export type ServiceState = 'registering' | 'starting' | 'running' | 'stopping' | 'stopped'
