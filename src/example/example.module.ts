import { Module } from "@nestjs/common";
import { OpenAiExampleController } from "./openai-example.controller";
import { OpenAiModule } from "src/lib/openai.module";

@Module({
    imports: [
        OpenAiModule.forRoot({
        apiKey: process.env.OPENAI_API_KEY,
        organization: process.env.OPENAI_ORGANIZATION,
        defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'gpt-3.5-turbo',
        defaultOptions: {
          temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
          maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
        }
      }),
    ],
    controllers: [OpenAiExampleController],
})
export class AppModule {}