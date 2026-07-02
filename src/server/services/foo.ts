import { Service } from 'shared/modules/service'
import { Services } from 'shared/modules/service-registry'

@Services.Declare
export class FooService extends Service {
	protected OnStart() {
		print('FooService started')
	}

	protected OnStop() {
		print('FooService stopped')
	}
}
