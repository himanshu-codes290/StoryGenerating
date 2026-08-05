
export type TextGenerationJobData = {
  text: string;
  task : string;
  tone : string;
  provider? :string
//   annotations : boolean;
}

export interface TextGenerationJobResult {
  textResult: string;
}