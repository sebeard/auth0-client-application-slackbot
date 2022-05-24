//External Libs
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request-promise')

// Internal Libs
const {accessToken} = require('./auth-token')
const { post } = require('request')

const { AUTH0_TENANT } = process.env
const app = express();
app.use(bodyParser.json());

app.get('/list-clients', async (req, res) => {

    try {
        const { token_type, access_token } = await accessToken();
        const response = await request({
          uri: `${AUTH0_TENANT}/api/v2/clients?fields=client_id,name,description&include_fields=true`,
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

app.post('/create-client/', async (req, res) => {

    try {
        const { token_type, access_token } = await accessToken();
        const response = await request({
          uri: `${AUTH0_TENANT}/api/v2/clients`,
          method: 'POST',
          json: true,
          headers: {
            authorization: [token_type, access_token].join(' '),
          },
          body : req.body,
        })
        res.status(201).send(response);
      } catch (error) {
        console.log(`Error: ${error.message}`);
        res.status(error.statusCode).send(`${error.message}`);
      }
});

app.get('/get-client/:clientId', async (req, res) => {

    try {
        const { token_type, access_token } = await accessToken();
        const response = await request({
          uri: `${AUTH0_TENANT}/api/v2/clients/${req.params.clientId}?fields=client_id,name,description&include_fields=true`,
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

app.delete('/get-client/:clientId', async (req, res) => {

    try {
        const { token_type, access_token } = await accessToken();
        const response = await request({
          uri: `${AUTH0_TENANT}/api/v2/clients/${req.params.clientId}?fields=client_id,name,description&include_fields=true`,
          method: 'DELETE',
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