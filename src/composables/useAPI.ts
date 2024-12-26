import { AxiosError } from 'axios'

const { setBuckets, getBucket, isBeian, getDir } = useUploadInfo()
const { setErrorInfo } = useOther()

interface UploadResult {
  code: number
  link?: string
  m: string
}

const refreshBuckets = async () => {
  try {
    const res = await request('/api/buckets')
    if (res.status === 200) {
      setBuckets(res.data)
    } else {
      setErrorInfo('Failed to get bucket list.')
    }
  } catch (err) {
    // @ts-ignore
    setErrorInfo(err.response.data)
  }
}

const upload = async (file: File): Promise<UploadResult> => {
  const bucket = getBucket()
  if (!bucket) {
    return Promise.resolve({
      code: 500,
      m: 'Please check the bucket configuration.'
    })
  } else {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', bucket)
    formData.append('beian', `${isBeian()}`)
    formData.append('type', file.type)
    formData.append('dir', getDir())
    try {
      const res = await request.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return Promise.resolve({
        code: 200,
        link: res.data.link,
        m: res.data.source
      })
    } catch (err) {
      if (err instanceof AxiosError) {
        return Promise.resolve({
          code: 500,
          m: err.response?.data
        })
      }
      return Promise.resolve({
        code: 500,
        m: JSON.stringify(err)
      })
    }
  }
}

export { UploadResult, refreshBuckets, upload }
