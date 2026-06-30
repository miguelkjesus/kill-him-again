import { ScriptLoader } from 'shared/script-loader'
import { Services } from 'shared/service-registry'

Services.Init()

const ServicesFolder = script.FindFirstChild('services')!
ScriptLoader.LoadChildrenOf(ServicesFolder)
