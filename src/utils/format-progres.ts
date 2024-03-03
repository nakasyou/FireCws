import type { CompileProgres } from '../compiler/types'

export const formatProgres = (progres: CompileProgres) => {
  let data = ''
  switch (progres.type) {
    case 'STARTED_CRX_TO_ZIP':
      data = '[core] Started .crx to .zip'
      break
    case 'FINISHED_CRX_TO_ZIP':
      data = '[core] Finished .crx to zip'
      break
    case 'STARTED_UNZIP':
      data = '[core] Started unzip'
      break
    case 'FINISHED_UNZIP':
      data = '[core] Finished unzip'
      break
    case 'FINISHED_COMPILEING':
      data = '[core] Finished Compileing!'
      break
    case 'FINISHED_RUNNING_PLUGIN':
      data = `[core]: Finished running plugin: ${progres.pluginName} (${progres.pluginIndex + 1}/${progres.plugins})`
      break
    case 'FINISHED_RUNNING_PLUGIN_TASK':
      data = `[core]: Finished running plugin task: ${progres.pluginName}-${progres.taskIndex + 1}/${progres.tasks})`
      break
    case 'FROM_PLUGIN':
      data = `[plugin: ${progres.pluginName}] ${progres.message}`
  }
  return data
}
