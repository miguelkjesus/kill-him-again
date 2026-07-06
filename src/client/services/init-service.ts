import { Service } from 'shared/modules/service'
import { Services } from 'shared/modules/service-registry'

import { FreeCameraMode } from './camera-service/modes'
import { CameraService } from './camera-service'

@Services.Declare
export class InitService extends Service {
	protected async OnStart() {
		const cameraService = await Services.Get(CameraService)

		cameraService.Push(new FreeCameraMode())
	}
}
