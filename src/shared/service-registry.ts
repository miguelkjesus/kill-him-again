import Service from './service'
import Signal from './signal'

interface Services {
	readonly Initialised: Signal.Event<[]>

	Init(): void
	IsReady(): boolean
	Add<S extends Service>(service: new () => S): Promise<S>
	AddAsync<T extends new () => Service>(service: T): T
	Get<S extends Service>(service: new () => S): Promise<S>
	Remove<S extends Service>(service: new () => S): Promise<S>
}

const _InitialisedSignal = new Signal<[]>()

const servicesImpl = {
	_InitialisedSignal: _InitialisedSignal,
	Initialised: _InitialisedSignal.Event,

	_isReady: false,

	_services: new Map<new () => Service, Service>(),

	Init() {
		this._isReady = true
		this._InitialisedSignal.Fire()
	},

	IsReady() {
		return this._isReady
	},

	async Add<S extends Service>(service: new () => S) {
		const instance = new service()
		this._services.set(service, instance)

		if (!this.IsReady) {
			await this.Initialised.Wait()
		}

		await instance.Start()
		return instance
	},

	AddAsync<T extends new () => Service>(service: T) {
		task.spawn(() => void this.Add(service))
		return service
	},

	async Get<S extends Service>(service: new () => S) {
		const instance = this._services.get(service) as S
		if (instance === undefined) error('Tried to get unregistered service.')

		switch (instance.GetState()) {
			case 'created':
			case 'starting':
				await instance.Started.Wait()
				return instance

			case 'running':
				return instance

			case 'stopping':
			case 'stopped':
				error('Tried to get a stopping or stopped service')
		}
	},

	async Remove<S extends Service>(service: new () => S) {
		const instance = await this.Get(service)
		await instance.Stop()

		this._services.delete(service)
		return instance
	},
}

const Services: Services = servicesImpl

export default Services
