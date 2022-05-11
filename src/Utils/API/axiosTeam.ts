import axios from 'axios'

const api = (url = '', method: any, data = {}) => {
  const options = {
    method,
    headers: {
      'content-type': 'text/plain',
      'Authorization' : `Bearer ${localStorage.getItem('token')}`
    },
     data,
    url: `${process.env.REACT_APP_TOKEN_API_URL}${url}`,
  }
  return axios(options)
}

export default api
