const swaggerJSDoc = require("swagger-jsdoc");

/**
 * Minimal OpenAPI (Swagger) configuration.
 * You can open docs at: http://localhost:5000/api/docs
 */
const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Memoria API",
            version: "1.0.0",
            description: "Advanced Databases (NoSQL) final project API documentation"
        },
        servers: [{ url: "http://localhost:5000" }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    // Keep it simple: scan route files for JSDoc blocks (we add key ones below)
    apis: [
        "./src/routes/*.js",
        "./src/models/*.js"
    ]
});

module.exports = swaggerSpec;
