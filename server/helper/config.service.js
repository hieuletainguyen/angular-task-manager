import Joi from "joi";

class ConfigService {
    constructor() {
        const envSchema = Joi.object({
            JWT_SECRET_KEY: Joi.string().required(),
            // DB_USER: Joi.string().required(),
            // DB_PASSWORD: Joi.string().required(),
            // DB_HOST: Joi.string().required(),
            // DB_PORT: Joi.number().default(5432),
            SALT_ROUNDS: Joi.number().required(),
            FRONTEND_URL: Joi.string(),
            NODE_ENV: Joi.string().required(),
            PROD_FRONTEND_URL: Joi.string(),
            DB_URL: Joi.string()
        }).unknown();

        const { error, value } = envSchema.validate(process.env);

        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }

        this.envConfig = value
    }

    get(key) {
        return this.envConfig[key];
    }
}

export default new ConfigService;