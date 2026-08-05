
export interface GenerateTextOptions {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  model? : string;
}

export interface AIProvider {
    generate(options: GenerateTextOptions): Promise<string>;
    generateTextStream(options: GenerateTextOptions) : AsyncGenerator<String>;
}