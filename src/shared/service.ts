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

	protected OnRegister() {
		// No-op
	}

	protected abstract OnStart(): void | Promise<void>

	protected abstract OnStop(): void | Promise<void>

	GetState() {
		return this._state
	}

	async Start() {
		this._state = 'starting'
		this.OnRegister()
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
}

export default Service
