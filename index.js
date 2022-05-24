//External Libs
require('dotenv').config()
const request = require('request-promise')

// Internal Libs
const {accessToken} = require('./auth-token')

const { AUTH0_TENANT } = process.env

const test = async () => {
    try {
      const { token_type, access_token } = await accessToken();
      const response = await request({
        uri: `${AUTH0_TENANT}/api/v2/clients?fields=client_id,name,description&include_fields=true`,
        json: true,
        headers: {
          authorization: [token_type, access_token].join(' '),
        },
      })
  
      console.log(response)
    } catch (error) {
      console.log(`Error: ${error.message}`)
    }
  }
    
test()