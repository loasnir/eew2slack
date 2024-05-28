import { loadXML, forceArray, unique } from './utils'

const EQVOL_URL = 'https://www.data.jma.go.jp/developer/xml/feed/eqvol.xml'
// const EQVOL_URL = 'https://www.data.jma.go.jp/developer/xml/feed/eqvol_l.xml' // for testing
const FILENAME_PATTERN = /_VXSE51/

type SeismicIntensityCode = '弱' | '強'

/**
 * 震度コードを比較する。下限 > 上限 > それ以外 の順。降順。
 * @param {SeismicIntensityCode} a 震度コード
 * @param {SeismicIntensityCode} b 震度コード
 * @returns {number} 比較結果
 * @example seismicIntensityCodeComparer('弱', '強') // 1
 * @example seismicIntensityCodeComparer('強', '弱') // -1
 * @example seismicIntensityCodeComparer('弱', '弱') // 0
 * @example seismicIntensityCodeComparer('強', '強') // 0
 * @example seismicIntensityCodeComparer('弱', undefined) // 0
 * @example seismicIntensityCodeComparer('強', undefined) // 0
 * @example seismicIntensityCodeComparer(undefined, '弱') // 0
 * @example seismicIntensityCodeComparer(undefined, '強') // 0
 * @example seismicIntensityCodeComparer(undefined, undefined) // 0
 */
export function seismicIntensityCodeComparer (a?: SeismicIntensityCode, b?: SeismicIntensityCode): number {
  if (a === undefined || b === undefined) return 0
  if (a === b) return 0
  if (a === '弱') return 1
  if (a === '強') return -1
  return 0
}

/**
 * 震度 1, 2, 3, 4, 5-, 5+, 6-, 6+, 7 の構造体
 */
interface SeismicIntensity {
  num: number
  code?: SeismicIntensityCode
}

/**
 * 震度を比較する 1, 2, 3, 4, 5-, 5+, 6-, 6+, 7 の順。降順。
 * @param {SeismicIntensity} a 震度
 * @param {SeismicIntensity} b 震度
 * @returns {number} 比較結果
 */
export function seismicIntensityComparer (a: SeismicIntensity, b: SeismicIntensity): number {
  return a.num < b.num ? 1 : a.num > b.num ? -1 : seismicIntensityCodeComparer(a.code, b.code)
}

interface EarthquakeWarningPref {
  name: string
  code: string
  max_int: SeismicIntensity
  areas?: EarthquakeWarningArea[]
}

interface EarthquakeWarningArea {
  name: string
  code: string
  max_int: SeismicIntensity
  pref: EarthquakeWarningPref
}

/**
 * 震源地の順番を比較する。震源地は都道府県 > 市区町村 の順で、コードの昇順。
 * @param {EarthquakeWarningPref} a 震源地
 * @param {EarthquakeWarningPref} b 震源地
 * @returns {number} 比較結果
 */
function areaComparer (a: EarthquakeWarningArea, b: EarthquakeWarningArea): number {
  return a.pref.code < b.pref.code ? -1 : a.code < b.code ? -1 : 1
}

interface EarthquakeEarlyWarningHeadline {
  max_int: SeismicIntensity
  areas: EarthquakeWarningArea[]
}

export interface EarthquakeEarlyWarningDetail {
  title: string
  text: string
  max_int: SeismicIntensity
  headlines: EarthquakeEarlyWarningHeadline[]
}

export interface EarthquakeEarlyWarning {
  title: string
  updated: string
  id: string
}

/**
 * 地震速報の情報を取得する
 * @returns {EarthquakeEarlyWarning[]} 地震速報の情報
 */
export function getEarthquakeEarlyWarning (): EarthquakeEarlyWarning[] {
  const xml = loadXML(EQVOL_URL)
  return xml.feed.entry.filter((e: any) => FILENAME_PATTERN.test(e.id))
}

/**
 * 地震速報の詳細情報を取得する
 * @param {string} url 地震速報のURL
 * @returns {EarthquakeEarlyWarningDetail} 地震速報の詳細情報
 */
export function getEarthquakeEarlyWarningDetail (url: string): EarthquakeEarlyWarningDetail | null {
  const xml = loadXML(url)
  if (xml.Report.Head.InfoType !== '発表') return null

  const areas = forceArray(xml.Report.Body.Intensity.Observation.Pref)
    .flatMap((pref: any): EarthquakeWarningArea[] => forceArray(pref.Area).map((area: any): EarthquakeWarningArea => ({
      pref: {
        name: pref.Name,
        code: pref.Code,
        max_int: convertSeismicIntensity(pref.MaxInt)
      },
      name: area.Name,
      code: area.Code,
      max_int: convertSeismicIntensity(area.MaxInt)
    })))

  const ints = unique(areas.map((area: EarthquakeWarningArea): SeismicIntensity => area.max_int), seismicIntensityComparer)

  const headlines = ints
    .map((int: SeismicIntensity): EarthquakeEarlyWarningHeadline => ({
      max_int: int,
      areas: areas.filter((a: EarthquakeWarningArea) => seismicIntensityComparer(a.max_int, int) === 0).sort(areaComparer)
    }))
    .sort((a: EarthquakeEarlyWarningHeadline, b: EarthquakeEarlyWarningHeadline): number => seismicIntensityComparer(a.max_int, b.max_int))

  return {
    title: xml.Report.Head.Title,
    text: xml.Report.Head.Headline.Text,
    max_int: headlines[0].max_int,
    headlines
  }
}

/**
 * 震度を構造体に変換する
 * @param {string} int 震度
 * @returns {SeismicIntensity} 震度の構造体
 */
export function convertSeismicIntensity (int: string): SeismicIntensity {
  const pattern = /(\d)([+-])?/
  const match = pattern.exec(int)

  if (match === null) {
    return { num: 0 }
  }

  const num = parseInt(match[1], 10)
  const code = match[2] === '+' ? '強' : match[2] === '-' ? '弱' : undefined

  return { num, code }
}
