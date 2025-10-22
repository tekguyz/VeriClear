
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { z } from 'zod';
import { withApiProtection } from '../utils/api';

const auditRecordSchema = z.object({
  problem_summary: z.string().min(10, { message: "Summary must be at least 10 characters." }).max(200),
  solution_steps: z.array(z.string()),
  compliance_flag: z.boolean(),
  call_sentiment: z.enum(['positive', 'neutral', 'negative', 'escalated']),
  agent_performance_score: z.number().min(1).max(10),
});


const logAuditRecordFunctionDeclaration: FunctionDeclaration = {
  name: 'log_audit_record',
  description: "Logs a structured audit record from a call center interaction.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      problem_summary: {
        type: Type.STRING,
        description: "A concise summary, between 10 and 200 characters, of the core issue or interaction outcome."
      },
      solution_steps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of steps taken or proposed to resolve the customer's issue."
      },
      compliance_flag: {
        type: Type.BOOLEAN,
        description: "A flag indicating if the interaction was fully compliant with all required procedures and disclosures. True for compliant, false for non-compliant."
      },
      call_sentiment: {
        type: Type.STRING,
        enum: ['positive', 'neutral', 'negative', 'escalated'],
        description: "The overall sentiment of the customer at the end of the call."
      },
      agent_performance_score: {
        type: Type.INTEGER,
        description: "A rating of the agent's performance on a scale of 1 to 10."
      }
    },
    required: ["problem_summary", "solution_steps", "compliance_flag", "call_sentiment", "agent_performance_score"]
  }
};

const systemInstruction = "You are an expert call center quality assurance auditor. Analyze the provided call recording/transcript and extract structured audit data. Always call the log_audit_record function with complete, accurate data.";

// Mock call transcript for demonstration
const mockTranscript = `
Agent: Thank you for calling VeriClear Support, this is Alex. How can I help you?
Customer: Hi, I'm having trouble with my recent bill. It seems higher than usual.
Agent: I can certainly look into that for you. Can I get your account number please?
Customer: Yes, it's 555-1234.
Agent: Thank you. One moment... Okay, I see the charge. It looks like your promotional period ended this month.
Customer: Oh, I wasn't aware of that. Is there anything you can do?
Agent: Let me see... Yes, it looks like we have a new loyalty discount I can apply. It will bring your bill down by 15%.
Customer: Oh, that's great! Thank you so much for your help.
Agent: You're welcome! Is there anything else I can assist with?
Customer: No, that's all.
Agent: Great. Thank you for calling VeriClear. Have a good day.
`;


const handler = async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }
    
    // The main logic is now cleaner, as the wrapper handles top-level errors.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: mockTranscript, // Using mock transcript
        config: {
            systemInstruction: systemInstruction,
            tools: [{ functionDeclarations: [logAuditRecordFunctionDeclaration] }],
        },
    });
    
    const functionCall = response.functionCalls?.[0];
    
    if (!functionCall || functionCall.name !== 'log_audit_record') {
        throw new Error("Gemini did not return the expected function call.");
    }
    
    const validationResult = auditRecordSchema.safeParse(functionCall.args);

    if (!validationResult.success) {
         console.error("Zod validation failed:", validationResult.error.flatten());
         throw new Error("Gemini response failed validation.");
    }

    const validatedData = validationResult.data;
    
    // Here you would insert validatedData into the 'audit_records' table.
    // logData('audit_records', validatedData);
    console.log("Data to be stored:", validatedData);

    // Mock delay for database operation
    await new Promise(res => setTimeout(res, 1000));
    
    return new Response(JSON.stringify({ success: true, data: validatedData }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
    });
};

export default withApiProtection(handler);