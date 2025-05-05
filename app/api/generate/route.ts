// File: app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Your NextAuth config
import db from '@/lib/db'; // Your Prisma client
import OpenAI from 'openai'; // OpenAI SDK
import { z } from 'zod'; // Zod for validation
import { Prisma } from '@prisma/client'; // Import Prisma type for transaction client

// --- Input Validation Schema ---
// Matches the FormData interface in MultiStepForm.tsx
const generateInputSchema = z.object({
  fullName: z.string().optional(),
  birthDay: z.string().optional(), // Keep as string for now
  commonNumbers: z.string().optional(),
  commonSymbols: z.string().optional(),
  commonWords: z.string().optional(),
  capitalizeWords: z.enum(['yes', 'no', 'sometimes']).optional(),
  replaceLetters: z.enum(['yes', 'no', 'sometimes']).optional(),
  passwordTestInput: z.string().optional(),
  otherInfo: z.string().optional(),
});

// --- OpenAI Configuration ---
// Ensure OPENAI_API_KEY is set in your .env file
if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable");
  // Avoid throwing here during build time, handle in POST
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- Cost per generation attempt ---
const GENERATION_COST = 1; // Set how many credits each attempt costs

// --- POST Handler ---
export async function POST(request: Request) {
  try {
    // 1. Verify Authentication & Get User ID/Credits
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. Check Credits & Decrement (Atomic Operation)
    let updatedUser;
    try {
        // Use Prisma transaction to ensure reading credits and updating is atomic
        // Add explicit type Prisma.TransactionClient for the 'prisma' parameter
        updatedUser = await db.$transaction(async (prisma: Prisma.TransactionClient) => {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { credits: true }
            });

            if (!user || user.credits < GENERATION_COST) {
                throw new Error('Insufficient credits'); // Custom error to catch below
            }

            // Decrement credits
            return await prisma.user.update({
                where: { id: userId },
                data: { credits: { decrement: GENERATION_COST } },
                select: { credits: true } // Select new credit balance
            });
        });
         // TODO: Update the user's session token with the new credit count
         // This requires triggering a session update, which is more complex.
         // For now, the header will show the old count until next login/refresh.

    } catch (error: any) {
         if (error.message === 'Insufficient credits') {
             return NextResponse.json({ message: 'Insufficient credits' }, { status: 403 }); // Forbidden
         }
         // Handle other potential transaction errors (e.g., database connection)
         console.error('Credit deduction error:', error);
         throw new Error('Failed to update credits'); // Throw generic error for outer catch block
    }


    // 3. Parse and Validate Input Body
    const body = await request.json();
    const validation = generateInputSchema.safeParse(body);
    if (!validation.success) {
      // Rollback credits? Or let the user try again? For now, credits are spent.
      console.error("Invalid input data:", validation.error.flatten());
      return NextResponse.json(
        { message: 'Invalid input data provided', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const formData = validation.data;

    // 4. Construct Prompt for GPT-4o (CRUCIAL PART)
    // This needs careful crafting based on your project's specific strategy.
    // Be EXTREMELY careful about privacy and not asking for sensitive info directly related to accounts.
    const prompt = `
      Analyze the following user-provided hints to generate a list of potential passwords they might have forgotten.
      Focus on common patterns and combinations based *only* on the provided information.
      Do NOT generate random passwords. Generate passwords that plausibly match the user's style based on these hints.
      Prioritize suggestions that incorporate multiple hints.

      Hints:
      - Full Name / Parts Used: ${formData.fullName || 'Not provided'}
      - Significant Date (e.g., Birthday): ${formData.birthDay || 'Not provided'}
      - Common Numbers: ${formData.commonNumbers || 'Not provided'}
      - Common Symbols: ${formData.commonSymbols || 'Not provided'}
      - Common Words/Phrases: ${formData.commonWords || 'Not provided'}
      - Capitalization Habit: ${formData.capitalizeWords || 'Not provided'}
      - Letter Replacement Habit (e.g., E->3, S->$): ${formData.replaceLetters || 'Not provided'}
      - Password Style Test (User created this from given elements): ${formData.passwordTestInput || 'Not provided'}
      - Other Notes/Patterns: ${formData.otherInfo || 'Not provided'}

      Based *only* on these hints, generate up to 15 password suggestions that combine these elements in plausible ways a user might create a password.
      Vary the combinations (e.g., name+year, word+symbol+number, initial+date+symbol).
      Consider common variations like adding numbers/symbols at the beginning/end, using different date formats (MMDD, YYYYMMDD, MMDDYY), common letter replacements if indicated.
      If the style test password was provided, try to mimic its structure (e.g., length, use of caps/numbers/symbols).

      Output ONLY the generated password suggestions, each on a new line. Do not include any other text, explanations, or labels.
      Example Output Format:
      PasswordSuggestion1
      SuggestionTwo!
      Word1990$
      ... (up to 15 lines)
    `;

    // 5. Call OpenAI API
    console.log("Sending prompt to OpenAI..."); // Log for debugging
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Use the specified GPT-4o model
      messages: [
        { role: "system", content: "You are a helpful assistant designed to suggest potential passwords based on user-provided hints about themselves and their habits. Focus on likely combinations, not random generation. Output only the suggestions, one per line." },
        { role: "user", content: prompt }
      ],
      max_tokens: 200, // Adjust as needed, depends on expected password length/count
      temperature: 0.6, // Lower temperature for more focused, less random output
      n: 1, // Generate one response
      stop: null, // Let the model decide when to stop
    });

    const rawSuggestions = completion.choices[0]?.message?.content?.trim();
    console.log("OpenAI Raw Response:", rawSuggestions); // Log for debugging

    if (!rawSuggestions) {
      throw new Error('OpenAI did not return any suggestions.');
    }

    // 6. Parse Response & Format Output
    const suggestions = rawSuggestions.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    // 7. Return Suggestions
    return NextResponse.json({ suggestions: suggestions, remainingCredits: updatedUser.credits }, { status: 200 });

  } catch (error: any) {
    console.error('Password Generation API Error:', error);
    // Handle specific errors if needed (e.g., OpenAI API errors)
    let status = 500;
    let message = 'An internal server error occurred during password generation.';
    if (error.message?.includes('Insufficient credits')) {
        status = 403; // Should have been caught earlier, but as fallback
        message = 'Insufficient credits.';
    } else if (error instanceof OpenAI.APIError) {
        status = error.status || 500;
        message = `OpenAI API Error: ${error.message}`;
    }

    // Note: Credits were likely already spent if the error occurred after the transaction.
    // Consider how to handle refunds or retries in a real application.
    return NextResponse.json({ message: message }, { status: status });
  }
}
