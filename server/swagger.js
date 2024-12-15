import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'task manager API', 
        version: '1.0.0', 
        description: 'task manager API'
    }
}

const options = {
    swaggerDefinition, 
    apis: ['./routes/*.js']
}


const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;