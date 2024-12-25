import { AxiosError } from 'axios'

const { setBuckets, getBucket, isBeian, getDir, getTinifyKey } = useUploadInfo()

interface UploadResult {
  code: number
  link?: string
  m: string
}

const refreshBuckets = async () => {
  const res = await request('/api/buckets')
  if (res.status === 200) {
    setBuckets(res.data)
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
    formData.append('tinifyKey', getTinifyKey())
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
