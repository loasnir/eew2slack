import fs from 'fs'

describe('getEarthquakeEarlyWarningDetail', () => {
  beforeAll(() => {
    global.UrlFetchApp = {
      fetch: jest.fn().mockImplementation((url: string) => {
        const xml = fs.readFileSync(url, 'utf-8')
        return {
          getContentText: () => xml
        }
      })
    } as any
  })

  it('returns EarthquakeEarlyWarningDetail', () => {
    const { getEarthquakeEarlyWarningDetail } = require('../src/jma')

    const expectedResponse = JSON.parse('{"title":"震度速報","text":"１１日０５時０７分ころ、地震による強い揺れを感じました。震度３以上が観測された地域をお知らせします。","max_int":{"num":6,"code":"弱"},"headlines":[{"max_int":{"num":6,"code":"弱"},"areas":[{"pref":{"name":"静岡県","code":22,"max_int":{"num":6,"code":"弱"}},"name":"静岡県中部","code":442,"max_int":{"num":6,"code":"弱"}},{"pref":{"name":"静岡県","code":22,"max_int":{"num":6,"code":"弱"}},"name":"静岡県西部","code":443,"max_int":{"num":6,"code":"弱"}}]},{"max_int":{"num":5,"code":"強"},"areas":[{"pref":{"name":"静岡県","code":22,"max_int":{"num":6,"code":"弱"}},"name":"静岡県伊豆","code":440,"max_int":{"num":5,"code":"強"}},{"pref":{"name":"静岡県","code":22,"max_int":{"num":6,"code":"弱"}},"name":"静岡県東部","code":441,"max_int":{"num":5,"code":"強"}}]},{"max_int":{"num":4},"areas":[{"pref":{"name":"千葉県","code":12,"max_int":{"num":4}},"name":"千葉県南部","code":342,"max_int":{"num":4}},{"pref":{"name":"東京都","code":13,"max_int":{"num":4}},"name":"東京都２３区","code":350,"max_int":{"num":4}},{"pref":{"name":"東京都","code":13,"max_int":{"num":4}},"name":"新島","code":356,"max_int":{"num":4}},{"pref":{"name":"神奈川県","code":14,"max_int":{"num":4}},"name":"神奈川県東部","code":360,"max_int":{"num":4}},{"pref":{"name":"神奈川県","code":14,"max_int":{"num":4}},"name":"神奈川県西部","code":361,"max_int":{"num":4}},{"pref":{"name":"山梨県","code":19,"max_int":{"num":4}},"name":"山梨県中・西部","code":411,"max_int":{"num":4}},{"pref":{"name":"山梨県","code":19,"max_int":{"num":4}},"name":"山梨県東部・富士五湖","code":412,"max_int":{"num":4}},{"pref":{"name":"長野県","code":20,"max_int":{"num":4}},"name":"長野県中部","code":421,"max_int":{"num":4}},{"pref":{"name":"長野県","code":20,"max_int":{"num":4}},"name":"長野県南部","code":422,"max_int":{"num":4}},{"pref":{"name":"岐阜県","code":21,"max_int":{"num":4}},"name":"岐阜県美濃東部","code":431,"max_int":{"num":4}},{"pref":{"name":"愛知県","code":23,"max_int":{"num":4}},"name":"愛知県西部","code":451,"max_int":{"num":4}}]},{"max_int":{"num":3},"areas":[{"pref":{"name":"群馬県","code":10,"max_int":{"num":3}},"name":"群馬県北部","code":320,"max_int":{"num":3}},{"pref":{"name":"群馬県","code":10,"max_int":{"num":3}},"name":"群馬県南部","code":321,"max_int":{"num":3}},{"pref":{"name":"埼玉県","code":11,"max_int":{"num":3}},"name":"埼玉県北部","code":330,"max_int":{"num":3}},{"pref":{"name":"埼玉県","code":11,"max_int":{"num":3}},"name":"埼玉県南部","code":331,"max_int":{"num":3}},{"pref":{"name":"埼玉県","code":11,"max_int":{"num":3}},"name":"埼玉県秩父","code":332,"max_int":{"num":3}},{"pref":{"name":"千葉県","code":12,"max_int":{"num":4}},"name":"千葉県北西部","code":341,"max_int":{"num":3}},{"pref":{"name":"東京都","code":13,"max_int":{"num":4}},"name":"東京都多摩東部","code":351,"max_int":{"num":3}},{"pref":{"name":"東京都","code":13,"max_int":{"num":4}},"name":"神津島","code":354,"max_int":{"num":3}},{"pref":{"name":"東京都","code":13,"max_int":{"num":4}},"name":"伊豆大島","code":355,"max_int":{"num":3}},{"pref":{"name":"東京都","code":13,"max_int":{"num":4}},"name":"三宅島","code":357,"max_int":{"num":3}},{"pref":{"name":"富山県","code":16,"max_int":{"num":3}},"name":"富山県東部","code":380,"max_int":{"num":3}},{"pref":{"name":"石川県","code":17,"max_int":{"num":3}},"name":"石川県加賀","code":391,"max_int":{"num":3}},{"pref":{"name":"福井県","code":18,"max_int":{"num":3}},"name":"福井県嶺北","code":400,"max_int":{"num":3}},{"pref":{"name":"福井県","code":18,"max_int":{"num":3}},"name":"福井県嶺南","code":401,"max_int":{"num":3}},{"pref":{"name":"長野県","code":20,"max_int":{"num":4}},"name":"長野県北部","code":420,"max_int":{"num":3}},{"pref":{"name":"岐阜県","code":21,"max_int":{"num":4}},"name":"岐阜県飛騨","code":430,"max_int":{"num":3}},{"pref":{"name":"岐阜県","code":21,"max_int":{"num":4}},"name":"岐阜県美濃中西部","code":432,"max_int":{"num":3}},{"pref":{"name":"愛知県","code":23,"max_int":{"num":4}},"name":"愛知県東部","code":450,"max_int":{"num":3}},{"pref":{"name":"三重県","code":24,"max_int":{"num":3}},"name":"三重県北部","code":460,"max_int":{"num":3}},{"pref":{"name":"滋賀県","code":25,"max_int":{"num":3}},"name":"滋賀県北部","code":500,"max_int":{"num":3}},{"pref":{"name":"滋賀県","code":25,"max_int":{"num":3}},"name":"滋賀県南部","code":501,"max_int":{"num":3}},{"pref":{"name":"奈良県","code":29,"max_int":{"num":3}},"name":"奈良県","code":540,"max_int":{"num":3}}]}]}')
    const actual = getEarthquakeEarlyWarningDetail('tests/assets/32-35_01_01_100806_VXSE51.xml')
    expect(actual).toMatchObject(expectedResponse)
  })
})

describe('convertSeismicIntensity', () => {
  const { convertSeismicIntensity } = require('../src/jma')

  it('returns SeismicIntensity', () => {
    expect(convertSeismicIntensity('3').num).toBe(3)
    expect(convertSeismicIntensity('3-').num).toBe(3)
    expect(convertSeismicIntensity('3+').num).toBe(3)
    expect(convertSeismicIntensity('3').code).toBe(undefined)
    expect(convertSeismicIntensity('3-').code).toBe('弱')
    expect(convertSeismicIntensity('3+').code).toBe('強')
  })
})

describe('seismicIntensityComparer', () => {
  const { seismicIntensityComparer } = require('../src/jma')

  it('returns number', () => {
    expect(seismicIntensityComparer({ num: 3 }, { num: 3 })).toBe(0)
    expect(seismicIntensityComparer({ num: 3 }, { num: 4 })).toBe(1)
    expect(seismicIntensityComparer({ num: 4 }, { num: 3 })).toBe(-1)
    expect(seismicIntensityComparer({ num: 3, code: '弱' }, { num: 3, code: '強' })).toBe(1)
    expect(seismicIntensityComparer({ num: 3, code: '強' }, { num: 3, code: '弱' })).toBe(-1)
    expect(seismicIntensityComparer({ num: 3, code: '弱' }, { num: 3, code: '弱' })).toBe(0)
    expect(seismicIntensityComparer({ num: 3, code: '強' }, { num: 3, code: '強' })).toBe(0)
    expect(seismicIntensityComparer({ num: 3 }, { num: 5, code: '弱' })).toBe(1)
    expect(seismicIntensityComparer({ num: 3 }, { num: 5, code: '強' })).toBe(1)
    expect(seismicIntensityComparer({ num: 7 }, { num: 5, code: '弱' })).toBe(-1)
    expect(seismicIntensityComparer({ num: 7 }, { num: 5, code: '強' })).toBe(-1)
  })

  it('sorts SeismicIntensity[]', () => {
    const intensities = [
      { num: 3 },
      { num: 5, code: '弱' },
      { num: 7 },
      { num: 5, code: '強' },
      { num: 4 },
      { num: 6, code: '弱' },
      { num: 6, code: '強' },
    ]
    const expected = [
      { num: 7 },
      { num: 6, code: '強' },
      { num: 6, code: '弱' },
      { num: 5, code: '強' },
      { num: 5, code: '弱' },
      { num: 4 },
      { num: 3 },
    ]
    expect(intensities.sort(seismicIntensityComparer)).toMatchObject(expected)
  })
})

describe('seismicIntensityCodeComparer', () => {
  const { seismicIntensityCodeComparer } = require('../src/jma')

  it('returns number', () => {
    expect(seismicIntensityCodeComparer(undefined, undefined)).toBe(0)
    expect(seismicIntensityCodeComparer(undefined, '弱')).toBe(0)
    expect(seismicIntensityCodeComparer(undefined, '強')).toBe(0)
    expect(seismicIntensityCodeComparer('弱', undefined)).toBe(0)
    expect(seismicIntensityCodeComparer('強', undefined)).toBe(0)
    expect(seismicIntensityCodeComparer('弱', '強')).toBe(1)
    expect(seismicIntensityCodeComparer('強', '弱')).toBe(-1)
    expect(seismicIntensityCodeComparer('弱', '弱')).toBe(0)
    expect(seismicIntensityCodeComparer('強', '強')).toBe(0)
  })
})
