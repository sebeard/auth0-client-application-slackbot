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
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/list-clients', async (req, res) => {

    try {
        const { token_type, access_token } = await accessToken();
        const response = await request({
          uri: `${AUTH0_TENANT}/api/v2/clients?fields=client_id,name,description&include_fields=true`,
          json: true,
          headers: {
            authorization: [token_type, access_token].join(' '),
          },
        })

        res.json(response)
      } catch (error) {
        console.log(`Error: ${error.message}`);
        res.json({ text: `An error occurred during listing: ${error.message}` });
      }
});

app.post('/create-client', async (req, res) => {

    try {
        const { token_type, access_token } = await accessToken();
        const response = await request({
          uri: `${AUTH0_TENANT}/api/v2/clients`,
          method: 'POST',
          json: true,
          headers: {
            authorization: [token_type, access_token].join(' '),
          },
          body : {
              name: req.body.text,
              description: `${req.body.text}'s description`
          }
        })
        res.json({ text: `Successully created ${req.body.text} with id ${response.client_id}` });
      } catch (error) {
        console.log(`Error: ${error.message}`);
        res.json({ text: `An error occurred during creation: ${error.message}` });
      }
});

app.post('/get-client', async (req, res) => {
    try {
        const { token_type, access_token } = await accessToken();
        const response = await request({
          uri: `${AUTH0_TENANT}/api/v2/clients/${req.body.text}?fields=client_id,name,description&include_fields=true`,
          json: true,
          headers: {
            authorization: [token_type, access_token].join(' '),
          },
        })
        res.json({ text: `Client application (${response.client_id}) - name: ${response.name} description: ${response.description}` });
      } catch (error) {
        console.log(`Error: ${error.message}`);
        res.json({ text: `An error occurred during retrieval: ${error.message}` });
      }
});

app.post('/update-client', async (req, res) => {
  // Inputs are [applicationId] [newName] [newDescription]
  var inputs = req.body.text.toString().split(' ');
  try {
      const { token_type, access_token } = await accessToken();
      const response = await request({
        uri: `${AUTH0_TENANT}/api/v2/clients/${inputs[0]}`,
        method: 'PATCH',
        json: true,
        headers: {
          authorization: [token_type, access_token].join(' '),
        },
        body : {
          name: `${inputs[1]}`,
          description: `${inputs[2]}`
        }
      })
      res.json({ text: `Client application (${response.client_id}) - name: ${response.name} description: ${response.description}` });
    } catch (error) {
      console.log(`Error: ${error.message}`);
      res.json({ text: `An error occurred during retrieval: ${error.message}` });
    }
});

app.post('/delete-client', async (req, res) => {

    try {
        const { token_type, access_token } = await accessToken();
        const response = await request({
          uri: `${AUTH0_TENANT}/api/v2/clients/${req.body.text}`,
          method: 'DELETE',
          json: true,
          headers: {
            authorization: [token_type, access_token].join(' '),
          },
        })
        res.send({ text: `Client application ${req.body.text} successfully deleted` });
      } catch (error) {
        console.log(`Error: ${error.message}`);
        res.send({ text: `An error occurred during deletion: ${error.message}` });
      }
});

app.listen(8080, () => console.log(`Listening on port 8080`))