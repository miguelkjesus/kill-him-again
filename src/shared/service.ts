import { Signal } from './signal'

export abstract class Service {
	private _state: ServiceState = 'created'

	private readonly StartingSignal = new Signal<[]>()
	readonly Starting = this.StartingSignal.Event

	private readonly StartedSignal = new Signal<[]>()
	readonly Started = this.StartedSignal.Event

	private readonly StoppingSignal = new Signal<[]>()
	readonly Stopping = this.StoppingSignal.Event

	private readonly StoppedSignal = new Signal<[]>()
	readonly Stopped = this.StoppedSignal.Event

	protected abstract OnStart(): void | Promise<void>

	GetState() {
		return this._state
	}

	async Start() {
		this._state = 'starting'
		if (IOnRegister(this)) this.OnRegister()
		this.StartingSignal.Fire()

		await Promise.try(() => this.OnStart())
		this._state = 'running'
		this.StartedSignal.Fire()
	}

	async Stop() {
		this._state = 'stopping'
		this.StoppingSignal.Fire()

		if (IOnStop(this)) {
			await Promise.try(() => this.OnStop())
		}

		this._state = 'stopped'
		this.StoppedSignal.Fire()
	}
}

export type ServiceState = 'created' | 'starting' | 'running' | 'stopping' | 'stopped'

export interface IOnRegister {
	OnRegister(): void
}

export function IOnRegister(value: unknown): value is IOnRegister {
	return typeIs(value, 'table') && 'OnRegister' in value && typeIs(value.OnRegister, 'function')
}

export interface IOnStop {
	// Only guaranteed to be on server shutdown
	// Only called on client on a manual `Service.Stop()`
	OnStop(): void | Promise<void>
}

export function IOnStop(value: unknown): value is IOnStop {
	return typeIs(value, 'table') && 'OnStop' in value && typeIs(value.OnStop, 'function')
}
