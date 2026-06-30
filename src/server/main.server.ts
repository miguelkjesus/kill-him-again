import { ScriptLoader } from 'shared/modules/script-loader'
import { Services } from 'shared/modules/service-registry'

Services.Init()

const ServicesFolder = script.FindFirstChild('services')!
ScriptLoader.LoadChildrenOf(ServicesFolder)
