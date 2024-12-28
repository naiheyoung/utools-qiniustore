type FileType = {
  name: string
  type: string
  size: number
  base64: string
  instance: File
}

export const useUploadFiles = defineStore('uploadFile', () => {
  let uploadFiles = $ref<FileType[]>([])

  const getFiles = (): FileType[] => uploadFiles
  const getFileNames = (): string[] => uploadFiles.map(file => file.name)
  const addFile = (file: FileType) => {
    if (getFileNames().includes(file.name)) return
    uploadFiles.push(file)
  }
  const removeFile = (fileName: string) => {
    const index = uploadFiles.findIndex(file => file.name === fileName)
    index >= 0 && uploadFiles.splice(index, 1)
  }

  return { getFiles, getFileNames, addFile, removeFile }
})

export const useUploadInfo = defineStore('uploadToken', () => {
  let accessKey = $ref<string>((db.get('ACCESS_KEY') as string) || '')
  let secretKey = $ref<string>((db.get('SECRET_KEY') as string) || '')
  let bucket = $ref<string>((db.get('BUCKET') as string) || '')
  let dir = $ref<string>((db.get('DIR') as string) || '')
  let buckets = $ref<string[]>((db.get('BUCKETS') as string[]) || [])
  let beian = $ref<boolean>(db.get('BEIAN') as boolean)
  let tinifyKey = $ref<string>((db.get('TINIFY_KEY') as string) || '')
  let auth = $ref<boolean>(db.get('AUTH') as boolean)

  const getAccessKey = () => accessKey
  const getSecretKey = () => secretKey
  const getBucket = () => bucket
  const getDir = () => dir
  const getBuckets = () => buckets
  const isBeian = () => beian
  const getTinifyKey = () => tinifyKey
  const isAuth = () => auth

  const setAccessKey = (v: string) => {
    accessKey = v
    db.set('ACCESS_KEY', v)
  }
  const setSecretKey = (v: string) => {
    secretKey = v
    db.set('SECRET_KEY', v)
  }
  const setBucket = (v: string) => {
    bucket = v
    db.set('BUCKET', v)
  }
  const setDir = (v: string) => {
    dir = v
    db.set('DIR', v)
  }
  const setBuckets = (v: string[]) => {
    buckets = v
    db.set('BUCKETS', v)
  }
  const setBeian = (v: boolean) => {
    beian = v
    db.set('BEIAN', v)
  }
  const setTinifyKey = (v: string) => {
    tinifyKey = v
    db.set('TINIFY_KEY', v)
  }
  const setAuth = (v: boolean) => {
    auth = v
    db.set('AUTH', v)
  }

  const getAll = () => {
    return {
      accessKey,
      secretKey,
      bucket,
      dir
    }
  }

  return {
    getAccessKey,
    getSecretKey,
    getBucket,
    getDir,
    setAccessKey,
    setSecretKey,
    setBucket,
    setDir,
    getAll,
    getBuckets,
    setBuckets,
    isBeian,
    setBeian,
    getTinifyKey,
    setTinifyKey,
    isAuth,
    setAuth
  }
})

export const useOther = defineStore('other', () => {
  let error = $ref<string>()
  let success = $ref<string>()

  const getErrorInfo = () => error
  const getSuccessInfo = () => success

  const clean = () => {
    success = ''
    error = ''
  }

  const setErrorInfo = (v: string) => {
    error = v
    useTimeoutFn(() => clean(), 3000)
  }
  const setSuccessInfo = (v: string) => {
    success = v
    useTimeoutFn(() => clean(), 5000)
  }

  return { getErrorInfo, getSuccessInfo, setErrorInfo, setSuccessInfo }
})
