import fs from 'fs'
import { XMLParser } from 'fast-xml-parser'

describe('convertToSlackMessage', () => {
  const files = [
    { file: 'tests/assets/32-35_01_01_100806_VXSE51.xml' },
    { file: 'tests/assets/32-35_07_01_100915_VXSE51.xml' },
    { file: 'tests/assets/32-35_07_02_100915_VXSE51.xml' },
    { file: 'tests/assets/32-35_07_03_100915_VXSE51.xml' },
    { file: 'tests/assets/32-35_07_04_100915_VXSE51.xml' },
    { file: 'tests/assets/32-35_07_05_100915_VXSE51.xml' },
    { file: 'tests/assets/32-39_11_01_120615_VXSE51.xml' },
  ]

  beforeAll(() => {
    global.Utilities = {
      formatDate: jest.fn().mockImplementation((date: Date, timezone: string, format: string) => {
        return date.toISOString()
      })
    } as any

    jest.mock('../src/utils', () => {
      const originalUtils = jest.requireActual('../src/utils');
      return {
        ...originalUtils,
        loadXML: jest.fn().mockImplementation((url: string) => {
          if(url.startsWith('https://')) {
            return {
              feed: {
                entry: files.map(f => ({ id: f.file, updated: '2010-08-06T00:00:00Z', title: '震度速報'}))
              }
            }
          }

          const xml = fs.readFileSync(url, 'utf-8')
          const xmlParser = new XMLParser()
          return xmlParser.parse(xml)
        })
      }
    });
  });

  it('returns SlackMessage', () => {
    const { convertToSlackMessage } = require('../src/notifier')
    const { getEarthquakeEarlyWarning, getEarthquakeEarlyWarningDetail } = require('../src/jma')
    const warning = getEarthquakeEarlyWarning().find((w:any) => w.id === 'tests/assets/32-35_01_01_100806_VXSE51.xml')
    const detail = getEarthquakeEarlyWarningDetail(warning.id)
    const actual = convertToSlackMessage(warning, detail)
    // console.log(JSON.stringify(actual))
    const expected = JSON.parse('[{"type":"header","text":{"type":"plain_text","text":":warning: 震度速報","emoji":true}},{"type":"divider"},{"type":"section","text":{"type":"mrkdwn","text":"<!channel> １１日０５時０７分ころ、地震による強い揺れを感じました。震度３以上が観測された地域をお知らせします。"}},{"type":"section","text":{"type":"mrkdwn","text":"*震度6弱*"}},{"type":"section","text":{"type":"plain_text","text":"静岡県中部、静岡県西部","emoji":true}},{"type":"section","text":{"type":"mrkdwn","text":"*震度5強*"}},{"type":"section","text":{"type":"plain_text","text":"静岡県伊豆、静岡県東部","emoji":true}},{"type":"section","text":{"type":"mrkdwn","text":"*震度4*"}},{"type":"section","text":{"type":"plain_text","text":"千葉県南部、東京都２３区、新島、神奈川県東部、神奈川県西部、山梨県中・西部、山梨県東部・富士五湖、長野県中部、長野県南部、岐阜県美濃東部、愛知県西部","emoji":true}},{"type":"section","text":{"type":"mrkdwn","text":"*震度3*"}},{"type":"section","text":{"type":"plain_text","text":"群馬県北部、群馬県南部、埼玉県北部、埼玉県南部、埼玉県秩父、千葉県北西部、東京都多摩東部、神津島、伊豆大島、三宅島、富山県東部、石川県加賀、福井県嶺北、福井県嶺南、長野県北部、岐阜県飛騨、岐阜県美濃中西部、愛知県東部、三重県北部、滋賀県北部、滋賀県南部、奈良県","emoji":true}},{"type":"context","elements":[{"type":"plain_text","text":"2010-08-06T00:00:00.000Z","emoji":true}]}]')
    expect(actual).toMatchObject(expected)
  })
})
