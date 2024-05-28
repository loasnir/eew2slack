import { XMLParser } from 'fast-xml-parser'
const xmlParser = new XMLParser()

type Comparer<T> = (a: T, b: T) => number
function defaultComparer<T> (a: T, b: T): number {
  return a < b ? -1 : a > b ? 1 : 0
}

export function unique<T> (array: T[], comparer: Comparer<T> = defaultComparer): T[] {
  return array.filter((value, index, self) => self.findIndex(item => comparer(value, item) === 0) === index)
}

export function forceArray<T> (value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export function loadXML (url: string): any {
  const content = UrlFetchApp.fetch(url).getContentText()
  return xmlParser.parse(content)
}
