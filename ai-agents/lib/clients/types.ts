export type LlmClient = {
  generateText(input: {
    model: string;
    prompt: string;
    systemInstruction?: string;
  }): Promise<string>;
  generateJsonText(input: {
    model: string;
    prompt: string;
    systemInstruction?: string;
  }): Promise<string>;
};
