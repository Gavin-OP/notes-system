export type LlmClient = {
  generateJsonText(input: {
    model: string;
    prompt: string;
    systemInstruction?: string;
  }): Promise<string>;
};
