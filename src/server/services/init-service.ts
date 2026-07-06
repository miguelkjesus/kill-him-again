import { Service } from 'shared/modules/service'
import { Services } from 'shared/modules/service-registry'

import { DungeonGeneratorService } from './dungeon-generator-service'

@Services.Declare
export class InitService extends Service {
	protected async OnStart() {
		const dungeonGenerator = await Services.Get(DungeonGeneratorService)

		dungeonGenerator.Generate()
	}
}
