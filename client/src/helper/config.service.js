import Joi from "joi";

class ConfigService {
    constructor() {
        const envSchema = Joi.object({
            BACKEND_URL: Joi.string()
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