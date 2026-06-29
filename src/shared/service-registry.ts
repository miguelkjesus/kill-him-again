import Service from './service'

interface Services {
	Add<S extends Service>(service: new () => S): Promise<S>
	AddAsync<T extends new () => Service>(service: T): T
	Get<S extends Service>(service: new () => S): Promise<S>
	Remove<S extends Service>(service: new () => S): Promise<S>
}

const _services = {
	_services: new Map<new () => Service, Service>(),

	async Add<S extends Service>(service: new () => S) {
		const instance = new service()
		this._services.set(service, instance)

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

const Services: Services = _services

export default Services
