require('dotenv').config()
const request = require('request-promise')
const { AUTH0_TENANT, CLIENT_ID, CLIENT_SECRET, DEFAULT_SCOPE } = process.env

async function accessToken() {
    return await request({
        uri: `${AUTH0_TENANT}/oauth/token`,
        json: true,
        method: 'POST',
        body: {
            client_id: `${CLIENT_ID}`,
            client_secret: `${CLIENT_SECRET}`,
            audience: `${AUTH0_TENANT}/api/v2/`,
            grant_type:"client_credentials"
          },
      })
}

module.exports = { accessToken }