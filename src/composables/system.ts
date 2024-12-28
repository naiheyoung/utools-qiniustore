const PREFIX = 'qiniustore:'
const CONSTANTS = {
  ACCESS_KEY: PREFIX + 'accessKey',
  SECRET_KEY: PREFIX + 'secretKey',
  BUCKET: PREFIX + 'bucket',
  DIR: PREFIX + 'dir',
  BUCKETS: PREFIX + 'buckets',
  BEIAN: PREFIX + 'beian',
  TINIFY_KEY: PREFIX + 'tinifyKey',
  AUTH: PREFIX + 'auth'
} as const

type KeyOptions =
  | 'ACCESS_KEY'
  | 'SECRET_KEY'
  | 'BUCKET'
  | 'DIR'
  | 'BUCKETS'
  | 'BEIAN'
  | 'TINIFY_KEY'
  | 'AUTH'
type ValueOptions = string | number | boolean | string[]

export const db = {
  // overwrite if it exists.
  set(key: KeyOptions, v: ValueOptions) {
    utools.dbCryptoStorage.setItem(CONSTANTS[key], v)
  },
  get(key: KeyOptions): ValueOptions {
    return utools.dbCryptoStorage.getItem(CONSTANTS[key])
  },
  del(key: KeyOptions) {
    utools.dbCryptoStorage.removeItem(CONSTANTS[key])
  }
}
