import Signal from 'shared/signal'

abstract class Service {
	private _state: Service.State = 'created'

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
		if (Service.OnRegister.implementedBy(this)) this.OnRegister()
		this.StartingSignal.Fire()

		await Promise.defer<void>((resolve) => {
			void Promise.try(() => this.OnStart()).then(() => {
				this._state = 'running'
				this.StartedSignal.Fire()
				resolve()
			})
		})
	}

	async Stop() {
		this._state = 'stopping'
		this.StoppingSignal.Fire()

		if (!Service.OnStop.implementedBy(this)) return

		await Promise.defer<void>((resolve) => {
			void Promise.try(() => this.OnStop()).then(() => {
				this._state = 'stopped'
				this.StoppedSignal.Fire()
				resolve()
			})
		})
	}
}

namespace Service {
	export type State = 'created' | 'starting' | 'running' | 'stopping' | 'stopped'

	export interface OnRegister {
		OnRegister(): void
	}

	export namespace OnRegister {
		export function implementedBy(value: unknown): value is OnRegister {
			return typeIs(value, 'table') && 'OnRegister' in value && typeIs(value.OnRegister, 'function')
		}
	}

	export interface OnStop {
		// Only guaranteed to be on server shutdown
		// Only called on client on a manual `Service.Stop()`
		OnStop(): void | Promise<void>
	}

	export namespace OnStop {
		export function implementedBy(value: unknown): value is OnStop {
			return typeIs(value, 'table') && 'OnStop' in value && typeIs(value.OnStop, 'function')
		}
	}
}

export default Service
