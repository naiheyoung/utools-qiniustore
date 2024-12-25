import axios from 'axios'

// const { setErrorInfo } = useOther()

const instance = axios.create({
  baseURL: 'http://localhost:9191',
  timeout: 0
})

instance.interceptors.response.use(
  res => res,
  err => {
    // setErrorInfo(err.response ? err.response.data : err.message)
    return Promise.reject(err)
  }
)

export { instance as request }
