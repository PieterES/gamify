import { Question } from "@/types/question";
import { mlopsInfraQuestions } from "./domain1-mlops-infra";
import { mlLifecycleQuestions } from "./domain2-ml-lifecycle";
import { genaiopsInfraQuestions } from "./domain3-genaiops-infra";
import { genaiQualityQuestions } from "./domain4-genai-quality";
import { genaiOptimizeQuestions } from "./domain5-genai-optimize";

// Exam AI-300: Operationalizing Machine Learning and Generative AI Solutions
export const ai300Questions: Question[] = [
  ...mlopsInfraQuestions,
  ...mlLifecycleQuestions,
  ...genaiopsInfraQuestions,
  ...genaiQualityQuestions,
  ...genaiOptimizeQuestions,
];

export {
  mlopsInfraQuestions,
  mlLifecycleQuestions,
  genaiopsInfraQuestions,
  genaiQualityQuestions,
  genaiOptimizeQuestions,
};
