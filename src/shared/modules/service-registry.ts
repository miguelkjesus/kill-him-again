import { RunService } from '@rbxts/services'

import { Service } from './service'
import { Signal, SignalEvent } from './signal'

export interface Services {
	readonly Initialised: SignalEvent<[]>

	Declare<T extends new () => Service>(this: void, service: T): T

	Init(): void
	IsReady(): boolean
	Add<S extends Service>(service: new () => S): Promise<S>
	Get<S extends Service>(service: new () => S): Promise<S>
	Remove<S extends Service>(service: new () => S): Promise<S>
	Clear(): Promise<void>
}

const _InitialisedSignal = new Signal<[]>()

const servicesImpl = {
	_InitialisedSignal: _InitialisedSignal,
	Initialised: _InitialisedSignal.Event,

	_isReady: false,

	_services: new Map<new () => Service, Service>(),

	Declare<T extends new () => Service>(this: void, service: T) {
		task.spawn(() => void Services.Add(service))
		return service
	},

	Init() {
		if (RunService.IsServer()) {
			game.BindToClose(() => this.Clear().await())
		}

		this._isReady = true
		this._InitialisedSignal.Fire()
	},

	IsReady() {
		return this._isReady
	},

	async Add<S extends Service>(service: new () => S) {
		const instance = new service()
		this._services.set(service, instance)

		if (!this.IsReady()) {
			await this.Initialised.Wait()
		}

		await instance.Start()
		return instance
	},

	async Get<S extends Service>(service: new () => S) {
		const instance = this._services.get(service) as S
		if (instance === undefined) error('Tried to get unregistered service.')

		switch (instance.GetState()) {
			case 'registering':
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

	async Clear() {
		const stopPromises: Promise<void>[] = []

		for (const [_, instance] of this._services) {
			stopPromises.push(instance.Stop())
		}

		await Promise.all(stopPromises)
		this._services.clear()
	},
}

export const Services: Services = servicesImpl
