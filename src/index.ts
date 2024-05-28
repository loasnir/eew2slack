import { getHistory, setHistory } from './history'
import { getEarthquakeEarlyWarning, getEarthquakeEarlyWarningDetail, type EarthquakeEarlyWarning, type EarthquakeEarlyWarningDetail } from './jma'
import { convertToSlackMessage, notifyToSlack } from './notifier'

global.main = function () {
  const history = getHistory()
  const warnings = getEarthquakeEarlyWarning()
  const notifiable = warnings
    .filter((warning) => !history.includes(warning.id))
    .map((warning) => ({
      warning,
      detail: getEarthquakeEarlyWarningDetail(warning.id)
    }))
    .filter(({ detail }) => detail !== null && detail.max_int.num >= 5)

  notifiable.forEach(({ warning, detail }): void => {
    if (detail === null) return

    Logger.log(`通知が必要な地震速報: ${warning.id}`)
    const message = convertToSlackMessage(warning, detail)
    notifyToSlack(message)
  })

  setHistory(warnings.map((warning) => warning.id))
}

global.storeTrigger = function () {
  ScriptApp.newTrigger('main')
    .timeBased()
    .everyMinutes(5)
    .create()
}

global.deleteTrigger = function () {
  const triggers = ScriptApp.getProjectTriggers()
  triggers.filter(trigger => trigger.getHandlerFunction() === 'main')
    .forEach(trigger => { ScriptApp.deleteTrigger(trigger) })
}

global.testing = function () {
  const warnings: Array<{ warning: EarthquakeEarlyWarning, detail: EarthquakeEarlyWarningDetail }> = [
    {
      warning: {
        title: 'test',
        updated: '2021-09-01T00:00:00Z',
        id: 'test'
      },
      detail: {
        title: 'test',
        text: 'test',
        max_int: { num: 5, code: '弱' },
        headlines: [
          {
            max_int: { num: 5, code: '弱' },
            areas: [{
              name: 'test',
              code: 'test',
              max_int: { num: 5, code: '弱' },
              pref: { name: 'test', code: 'test', max_int: { num: 5, code: '弱' } }
            }]
          },
          {
            max_int: { num: 4 },
            areas: [{
              name: 'test',
              code: 'test',
              max_int: { num: 4 },
              pref: { name: 'test', code: 'test', max_int: { num: 4 } }
            },
            {
              name: 'test2',
              code: 'test2',
              max_int: { num: 4 },
              pref: { name: 'test2', code: 'test2', max_int: { num: 4 } }
            }
            ]
          }
        ]
      }
    }
  ]

  warnings.forEach(({ warning, detail }) => {
    const message = convertToSlackMessage(warning, detail)
    notifyToSlack(message)
  })
}
