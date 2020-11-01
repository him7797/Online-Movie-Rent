const winston=require('winston');
const express = require('express');
const app = express();
const swaggerUI=require('swagger-ui-express');
const swaggerDocument=require('./config/swagger.json');

require('./startup/logging');//handling errors 
require('./startup/routes')(app);//routes handling
require('./startup/db')();//setting up db
require('./startup/config')();//jwt configuration


//initialising the swaggerUI

var customSwaggerOptions = {
    explorer: true,
    swaggerOptions: {
        authAction: {
            JWT: {
                name: 'JWT',
                schema: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: ''
                },
                value: 'Bearer <my own JWT token>'
            }
        }
    }
}
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument,customSwaggerOptions));
const port = process.env.PORT || 5000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
