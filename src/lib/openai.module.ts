import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenAiService } from './openai.service';
import openAiConfig, { OpenAiOptions } from './openai.config';
import { OpenAiExampleController } from './controllers/openai-example.controller';

@Module({
  controllers: [OpenAiExampleController],
  providers: [OpenAiService],
  imports: [ConfigModule.forFeature(openAiConfig)],
  exports: [OpenAiService],
})
export class OpenAiModule {
  /**
   * Registra el módulo OpenAI con configuración dinámica
   */
  static forRoot(options?: OpenAiOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: 'OPENAI_OPTIONS',
        useValue: options || {},
      },
      OpenAiService,
    ];

    return {
      global: true,
      module: OpenAiModule,
      imports: [ConfigModule.forFeature(openAiConfig)],
      providers,
      exports: [OpenAiService],
    };
  }

  /**
   * Registra el módulo OpenAI utilizando la configuración del ConfigService
   */
  static forRootAsync(options: {
    useFactory: (...args: any[]) => OpenAiOptions;
    inject?: any[];
  }): DynamicModule {
    const providers: Provider[] = [
      {
        provide: 'OPENAI_OPTIONS',
        useFactory: options.useFactory,
        inject: options.inject || [ConfigService],
      },
      OpenAiService,
    ];

    return {
      global: true,
      module: OpenAiModule,
      imports: [ConfigModule.forFeature(openAiConfig)],
      providers,
      exports: [OpenAiService],
    };
  }
}
