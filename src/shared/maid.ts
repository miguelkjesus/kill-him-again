import { ISignal } from './signal'

class Maid {
	private _items = new Set<Maid.Cleanable>()

	Add(item: Maid.Cleanable) {
		this._items.add(item)
	}

	Remove(item: Maid.Cleanable) {
		this._items.delete(item)
	}

	Has(item: Maid.Cleanable) {
		this._items.has(item)
	}

	Clear() {
		this._items.clear()
	}

	IsEmpty() {
		this._items.clear()
	}

	Clean() {
		for (const item of this._items) {
			if (item instanceof Maid) {
				item.Clean()
			} else if (IDestroyable.implementedBy(item)) {
				item.Destroy()
			} else {
				item.Disconnect()
			}
		}
	}
}

namespace Maid {
	export type Cleanable = Maid | IDestroyable | ISignal.Connection
}

export default Maid

export interface IDestroyable {
	Destroy(): void
}

export namespace IDestroyable {
	export function implementedBy(value: unknown): value is IDestroyable {
		return typeIs(value, 'table') && 'Destroy' in value && typeIs(value.Destroy, 'function')
	}
}
