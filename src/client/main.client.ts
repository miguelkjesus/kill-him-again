import { ReplicatedStorage, StarterPlayer } from '@rbxts/services'
import { ScriptLoader } from 'shared/modules/script-loader'
import { Services } from 'shared/modules/service-registry'

Services.Init()

const ClientServicesFolder = StarterPlayer.StarterPlayerScripts.TS.services
const SharedServicesFolder = ReplicatedStorage.TS.services

ScriptLoader.LoadChildrenOf(SharedServicesFolder)
ScriptLoader.LoadChildrenOf(ClientServicesFolder)
