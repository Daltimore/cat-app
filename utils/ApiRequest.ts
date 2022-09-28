import axios from "axios"

const baseURL = 'http://tnorthern.xyz/Edgewood-API/public/api/'

const http = axios.create({ baseURL })

http.interceptors.response.use(
  (res: any) => {
    const actualResponse = res
    if (
      actualResponse.log_user_out ||
      actualResponse.response_message === 'Token Session Expired'
    ) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return actualResponse.data
  },
  (err) => {
    return err
  }
)

http.interceptors.request.use((config: any) => {
  Object.assign(config, {
    data: config.data,
  })

  return config
})

export default http