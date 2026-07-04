import { ISignalConnection } from './signal'

export class Maid {
	private _items = new Set<MaidCleanable>()

	Add(item: MaidCleanable) {
		this._items.add(item)
	}

	Remove(item: MaidCleanable) {
		this._items.delete(item)
	}

	Has(item: MaidCleanable) {
		this._items.has(item)
	}

	Clear() {
		this._items.clear()
	}

	Size() {
		return this._items.size()
	}

	IsEmpty() {
		return this.Size() === 0
	}

	Clean() {
		for (const item of this._items) {
			if (item instanceof Maid) {
				item.Clean()
			} else if (IDestroyable(item)) {
				item.Destroy()
			} else {
				item.Disconnect()
			}
		}
	}
}

export type MaidCleanable = Maid | IDestroyable | ISignalConnection

export interface IDestroyable {
	Destroy(): void
}

export function IDestroyable(value: unknown): value is IDestroyable {
	return typeIs(value, 'table') && 'Destroy' in value && typeIs(value.Destroy, 'function')
}
