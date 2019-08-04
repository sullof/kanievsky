import axios from 'axios'

class ClientApi {

  async request(
    api,
    method = 'get',
    headers = {},
    params = {}
    ) {

    params = Object.assign({
      url: `${window.location.origin}/api/${api}`,
      method,
      responseType: 'json',
      headers
    }, params)

    return axios(params)
      .then(res => {
        return res.data
      })
      .catch(err => {
        return {
          status: 500,
          message: err.message
        }
      })
  }
}

export default new ClientApi()
