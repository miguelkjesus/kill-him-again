import { ReplicatedStorage, Workspace } from '@rbxts/services'
import { Maid } from 'shared/modules/maid'
import { Service } from 'shared/modules/service'
import { Services } from 'shared/modules/service-registry'

@Services.Declare
export class DungeonGeneratorService extends Service {
	Generate({ Origin = CFrame.identity }: GenerateOptions = {}) {
		const maid = new Maid()

		const SpawnPrefab = ReplicatedStorage.DungeonRooms.Spawn
		const RoomPrefab = ReplicatedStorage.DungeonRooms.Room

		let NextOrigin = Origin

		const Spawn = SpawnPrefab.Clone()
		Spawn.PivotTo(NextOrigin)
		Spawn.Parent = Workspace
		maid.Add(Spawn)

		NextOrigin = Spawn.NextOrigin.CFrame

		const Room = RoomPrefab.Clone()
		Room.PivotTo(NextOrigin)
		Room.Parent = Workspace
		maid.Add(Room)

		return maid
	}
}

export interface GenerateOptions {
	Origin?: CFrame
}
