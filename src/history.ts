
const SCRIPT_PROPERTY_KEY_NOTIFIED_HISTORY = 'notified_history'
/**
 * 通知済みの地震速報を取得する。
 * データストアにはスクリプトプロパティを使用する。
 * @returns {string[]} 通知済みの地震速報ID
 */

export function getHistory (): string[] {
  const scriptProperties = PropertiesService.getScriptProperties()
  const notified = scriptProperties.getProperty(SCRIPT_PROPERTY_KEY_NOTIFIED_HISTORY)
  return (notified ?? '').split(',')
}
/**
 * 通知済みの地震速報を保存する。
 * データストアにはスクリプトプロパティを使用する。
 * @param {string[]} ids 通知済みの地震速報ID
 */
export function setHistory (ids: string[]): void {
  const scriptProperties = PropertiesService.getScriptProperties()
  scriptProperties.setProperty(SCRIPT_PROPERTY_KEY_NOTIFIED_HISTORY, ids.join(','))
}
