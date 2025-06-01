import OpenAI from 'openai';
import type { AssistantConfig } from './configs/assistant_config.js';
import { logger } from '../utils/logger.js';

type Parser<T> = (response: any) => T;

export class Assistant {
    private client: OpenAI;
    private config: AssistantConfig;

    constructor(config: AssistantConfig, client: OpenAI) {
        this.config = config;
        this.client = client;
    }

    public async sendMessage<T>(content: string, parser: Parser<T>): Promise<T> {
        try {
            const response = await this.client.responses.create({
                model: this.config.model,
                instructions: this.config.instructions,
                input: content,
                text: this.config.text,
                temperature: this.config.temperature,
            });
            logger.info({
                message: 'Assistant response',
                content: content,
                response: JSON.parse(response.output_text)
            });
            return parser(JSON.parse(response.output_text));
        } catch (error) {
            throw error;
        }
    }
} 