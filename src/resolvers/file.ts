import * as importedPath from 'path'
import {Loader} from '../types'

// inline fp methods due to perf
const uniq = arr => arr.filter((elem, pos, a) => a.indexOf(elem) === pos)

export const reversePathsToWalk = ({folder, path}) => {
  const resolved = path.resolve(folder)
  const parts = resolved.split(path.sep)
  const results = parts.map((_, idx, arr) =>
    arr.slice(0, idx + 1).join(path.sep),
  )
  results[0] = results[0] || '/'
  return results.reverse()
}

export const configLookup = (file: string, folder: string, path: any = importedPath) =>
  uniq(reversePathsToWalk({folder, path}).map(p => path.join(p, file)))

export class FileResolver {
  file: string
  loader: Loader

  constructor(file: string, loader: Loader) {
    this.file = file
    this.loader = loader
  }

  async resolve(from: string) {
    const configCandidates = configLookup(this.file, from)
    const {exists, load, none} = this.loader
    for (const candidate of configCandidates) {
      if (await exists(candidate)) {
        return load(candidate)
      }
    }
    return none(from)
  }
}
