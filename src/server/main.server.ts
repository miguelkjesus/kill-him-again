import { ReplicatedStorage, ServerScriptService } from '@rbxts/services'
import { ScriptLoader } from 'shared/modules/script-loader'
import { Services } from 'shared/modules/service-registry'

Services.Init()

const ServerServicesFolder = ServerScriptService.TS.services
const SharedServicesFolder = ReplicatedStorage.TS.services

ScriptLoader.LoadChildrenOf(SharedServicesFolder)
ScriptLoader.LoadChildrenOf(ServerServicesFolder)
