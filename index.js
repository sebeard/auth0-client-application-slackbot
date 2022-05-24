//External Libs
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request-promise')

// Internal Libs
const {accessToken} = require('./auth-token')

const { AUTH0_TENANT } = process.env
const app = express();
app.use(bodyParser.json());

app.get('/list-clients', async (req, res) => {

    try {
        const { token_type, access_token } = await accessToken();
        const response = await request({
          uri: `${AUTH0_TENANT}/api/v2/clients2?fields=client_id,name,description&include_fields=true`,
          json: true,
          headers: {
            authorization: [token_type, access_token].join(' '),
          },
        })
        res.send(response);
      } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(error.statusCode).send(`${error.message}`);
      }
});

app.listen(8080, () => console.log(`Listening on port 8080`))