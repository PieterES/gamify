import { Question } from "@/types/question";
import { clfQuestions } from "./clf";
import { deaQuestions } from "./dea";
import { mlaQuestions } from "./mla";

// AWS Certified Cloud Practitioner (CLF-C02), Data Engineer – Associate (DEA-C01)
// and Machine Learning Engineer – Associate (MLA-C02)
export const awsQuestions: Question[] = [...clfQuestions, ...deaQuestions, ...mlaQuestions];

export { clfQuestions, deaQuestions, mlaQuestions };
