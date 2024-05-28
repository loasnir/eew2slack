import { type EarthquakeEarlyWarning, type EarthquakeEarlyWarningDetail } from './jma'

const SCRIPT_PROPERTY_KEY_SLACK_WEBHOOK_URL = 'slack_webhook_url'

/**
 * Slack に通知する
 * @param {string} message 通知内容
 * @returns {void} 通知に成功したかどうか
 */
export function notifyToSlack (blocks: any): void {
  const webhookUrl = PropertiesService.getScriptProperties().getProperty(SCRIPT_PROPERTY_KEY_SLACK_WEBHOOK_URL) ?? ''
  const payload = {
    blocks
  }

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  } as any

  UrlFetchApp.fetch(webhookUrl, options)
}

export function convertToSlackMessage (warning: EarthquakeEarlyWarning, detail: EarthquakeEarlyWarningDetail): any {
  const header = {
    type: 'header',
    text: {
      type: 'plain_text',
      text: `:warning: ${detail.title}`,
      emoji: true
    }
  }

  const hr = {
    type: 'divider'
  }

  const text = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `<!channel> ${detail.text}`
    }
  }

  const headlines = detail.headlines.flatMap(headline => {
    const maxInt = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*震度${headline.max_int.num}${headline.max_int.code ?? ''}*`
      }
    }

    const areas = {
      type: 'section',
      text: {
        type: 'plain_text',
        text: headline.areas.map(area => area.name).join('、'),
        emoji: true
      }
    }

    return [maxInt, areas]
  })

  const context = {
    type: 'context',
    elements: [
      {
        type: 'plain_text',
        text: Utilities.formatDate(new Date(warning.updated), 'JST', 'yyyy-MM-dd HH:mm:ss'),
        emoji: true
      }
    ]
  }

  return [header, hr, text, ...headlines, context]
}
