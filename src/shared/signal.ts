type Subscription<Args extends unknown[] = any[]> = (...args: Args) => unknown

export class Signal<Args extends unknown[] = any[]> implements ISignal {
	private readonly _subscriptions = new Set<Subscription<Args>>()
	private readonly _once = new Set<Subscription<Args>>()

	readonly Event = new SignalEvent(this._subscriptions, this._once)

	Fire(...args: Args) {
		for (const callback of this._subscriptions) {
			callback(...args)
		}

		for (const callback of this._once) {
			callback(...args)
		}

		this._once.clear()
	}
}
export class SignalEvent<Args extends unknown[] = any[]> implements ISignalEvent {
	/** @internal */
	constructor(subscriptions: Set<Subscription<Args>>, once: Set<Subscription<Args>>) {
		this._subscriptions = subscriptions
		this._once = once
	}

	private readonly _subscriptions: Set<Subscription<Args>>
	private readonly _once: Set<Subscription<Args>>

	Connect(callback: (...args: Args) => unknown) {
		this._subscriptions.add(callback)
		return new SignalConnection(this._subscriptions, callback)
	}

	Once(callback: (...args: Args) => unknown) {
		this._once.add(callback)
		return new SignalConnection(this._once, callback)
	}

	async Wait(predicate?: (...args: Args) => boolean) {
		return new Promise<Args>((resolve) => {
			if (!predicate) {
				this.Once((...args) => resolve(args))
				return
			}

			const connection = this.Connect((...args) => {
				if (predicate(...args)) return

				connection.Disconnect()
				resolve(args)
			})
		})
	}
}

export class SignalConnection implements ISignalConnection {
	/** @internal */
	constructor(subcriptions: Set<Subscription>, callback: Subscription) {
		this._subcriptions = subcriptions
		this._callback = callback
	}

	private readonly _subcriptions: Set<Subscription>
	private readonly _callback: Subscription
	private _connected = true

	IsConnected() {
		return this._connected
	}

	Disconnect() {
		this._subcriptions.delete(this._callback)
		this._connected = false
	}
}
export interface ISignal<Args extends unknown[] = any[]> {
	readonly Event: ISignalEvent<Args>
	Fire(...args: Args): void
}

export interface ISignalEvent<Args extends unknown[] = any[]> {
	Connect(callback: (...args: Args) => unknown): ISignalConnection
	Once(callback: (...args: Args) => unknown): ISignalConnection
}

export interface ISignalConnection {
	IsConnected(): boolean
	Disconnect(): void
}
