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
  let accessKey = $ref<string>('')
  let secretKey = $ref<string>('')
  let bucket = $ref<string>('')
  let dir = $ref<string>('')
  let buckets = $ref<string[]>([])
  let beian = $ref<boolean>(true)
  let tinifyKey = $ref<string>('')

  const getAccessKey = () => accessKey
  const getSecretKey = () => secretKey
  const getBucket = () => bucket
  const getDir = () => dir
  const getBuckets = () => buckets
  const isBeian = () => beian
  const getTinifyKey = () => tinifyKey

  const setAccessKey = (v: string) => (accessKey = v)
  const setSecretKey = (v: string) => (secretKey = v)
  const setBucket = (v: string) => (bucket = v)
  const setDir = (v: string) => (dir = v)
  const setBuckets = (v: string[]) => (buckets = v)
  const setBeian = (v: boolean) => (beian = v)
  const setTinifyKey = (v: string) => (tinifyKey = v)

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
    setTinifyKey
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
