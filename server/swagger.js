import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Task Manager API', 
        version: '1.0.0', 
        description: 'Task Manager API'
    }
}

const options = {
    swaggerDefinition, 
    apis: ['./routes/*.js']
}


const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;