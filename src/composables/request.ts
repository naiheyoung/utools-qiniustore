import axios from 'axios'

// const { setErrorInfo } = useOther()
const { getAccessKey, getSecretKey, getTinifyKey } = useUploadInfo()

const instance = axios.create({
  baseURL: 'http://localhost:9191',
  timeout: 0
})

instance.interceptors.request.use(
  config => {
    config.headers['accessKey'] = getAccessKey()
    config.headers['secretKey'] = getSecretKey()
    config.headers['tinifyKey'] = getTinifyKey()
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  res => res,
  err => {
    // setErrorInfo(err.response ? err.response.data : err.message)
    return Promise.reject(err)
  }
)

export { instance as request }
