import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import type { JobListing } from "../lib/jobParser";
import type { getUserProfile } from "../lib/utils";

const CoverLetterSchema = z.object({
  suitableJobs: z.array(
    z.object({
      jobId: z.string(),
      jobTitle: z.string(),
      company: z.string(),
      matchScore: z.number().min(1).max(10),
      matchReasons: z.array(z.string()),
      coverLetter: z.string(),
      keySkillsMatch: z.array(z.string()),
      whyPerfectFit: z.string(),
    }),
  ),
  rejectedJobs: z.array(
    z.object({
      jobId: z.string(),
      jobTitle: z.string(),
      company: z.string(),
      rejectionReason: z.string(),
    }),
  ),
});

type CoverLetterSchemaType = z.infer<typeof CoverLetterSchema>;

export type CoverLetterMatch = CoverLetterSchemaType["suitableJobs"][number];

export type AIProvider = "openai" | "anthropic" | "google" | "groq";

export function getAiProvider(): AIProvider | undefined {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return "google";
  if (process.env.GROQ_API_KEY) return "groq";
  if (process.env.OPENAI_API_KEY) return "openai";
  throw new Error("please set ai provider api key in the env");
}

function getModel() {
  const provider = getAiProvider();
  switch (provider) {
    case "openai":
      return openai("gpt-4o-mini");
    case "anthropic":
      return anthropic("claude-3-haiku-20240307");
    case "google":
      return google("gemini-1.5-flash");
    case "groq":
      return groq("openai/gpt-oss-120b");
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

function createSystemPrompt(
  userProfile: Awaited<ReturnType<typeof getUserProfile>>,
): string {
  return `You are a personal assistant for ${userProfile.fullName}. They are extremely busy with personal and work commitments, so they need your help with job applications.

IMPORTANT: Do NOT auto-generate cover letters for every job. You need to be selective and strategic.

Here's how you should approach this:

1. **ANALYZE FIRST**: Look at each job carefully and determine if ${userProfile.fullName} is actually a good fit
2. **BE SELECTIVE**: Only generate cover letters for jobs where they have a genuine chance and relevant experience
3. **QUALITY OVER QUANTITY**: It's better to have 2-3 excellent matches than 10 mediocre ones

About ${userProfile.fullName}:
- Professional Summary: ${userProfile.professionalSummary}
- Current Skills: ${userProfile.skills.join(", ")}
- Experience: ${userProfile?.experiences?.map((exp) => `${exp.position} at ${exp.company} (${exp.duration}): ${exp.description}`).join(" | ")}
- Education: ${userProfile.educations[0]?.degree} from ${userProfile.educations[0]?.institution} (${userProfile.educations[0]?.year})
- Languages: ${userProfile.languages.join(", ")}
- Key Achievements: ${userProfile.achievements.join(", ")}

For each job, you must:

**IF IT'S A GOOD MATCH:**
- Generate a personalized cover letter that sounds natural and professional
- Explain specifically why ${userProfile.fullName} is perfect for this role
- Highlight relevant skills and experience that match the job requirements
- Show enthusiasm but keep it professional
- Mention specific achievements that relate to the role

**IF IT'S NOT A GOOD MATCH:**
- Add it to rejectedJobs with a clear reason why it's not suitable
- Don't waste time generating a cover letter

**Cover Letter Style:**
- **CRITICAL: Maximum 900 characters (strict limit - the platform rejects anything over 1000)**
- Professional but conversational tone - avoid being overly formal
- 2-3 short paragraphs maximum
- Start with enthusiasm for the specific role (don't repeat company name unnecessarily)
- Middle paragraph: highlight 2-3 most relevant experiences/skills only
- End with a brief call to action
- Use ${userProfile.fullName}'s actual experience and achievements
- Be concise and impactful - every word counts
- Write naturally - avoid phrases like "I am pleased to apply" or overly corporate language

**CRITICAL: This cover letter will be directly submitted to the job application form. Do not include:**
- Placeholder text like [Company Name]
- References to "the company" when you can be more specific
- Overly formal salutations or closings
- Any formatting that won't work in a plain text field
- Mistakes or generic content that could hurt the application
- Unnecessary filler words or repetition

**CHARACTER COUNT REQUIREMENT:**
- Your cover letter MUST be under 900 characters
- Count every character including spaces and punctuation
- If you go over, cut content - don't just summarize, remove entire sentences
- Prioritize impact over length

Remember: You're helping a busy professional find the RIGHT opportunities, not just any opportunities. The cover letter you generate will be sent directly to employers, so make it count. Keep it concise and under 900 characters!`;
}

export async function generateCoverLetters(
  userProfile: Awaited<ReturnType<typeof getUserProfile>>,
  jobs: JobListing[],
): Promise<{
  suitableJobs: CoverLetterMatch[];
  rejectedJobs: Array<{
    jobId: string;
    jobTitle: string;
    company: string;
    rejectionReason: string;
  }>;
}> {
  const model = getModel();

  const jobsContext = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    skills: job.skills,
    experienceLevel: job.experienceLevel,
    jobType: job.jobType,
    salary: job.salary,
  }));

  const result = await generateObject({
    model,
    schema: CoverLetterSchema,
    system: createSystemPrompt(userProfile),
    prompt: `Here are the available job listings. Please analyze each one and determine which jobs ${userProfile.fullName} would be a good fit for, then generate personalized cover letters only for the suitable positions.

Jobs to analyze:
${JSON.stringify(jobsContext, null, 2)}

Please be selective and only generate cover letters for jobs where there's a genuine match between the candidate's background and the job requirements.`,
  });

  return {
    suitableJobs: result.object.suitableJobs,
    rejectedJobs: result.object.rejectedJobs,
  };
}
