import { GoogleGenAI } from '@google/genai';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

const secret = process.env.NEXTAUTH_SECRET;

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1, 'Message content is required').max(5000),
});

const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(5000),
  history: z.array(chatMessageSchema).optional(),
});

export const POST = async (
  req: NextRequest,
): Promise<NextResponse<{ response: string } | { message: string }>> => {
  const token = await getToken({ req, secret });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ message: 'Gemini API key is not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { message, history = [] } = chatRequestSchema.parse(body);

    const genAI = new GoogleGenAI({ apiKey });

    // Build conversation history for context
    const conversationHistory = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Add current user message
    const contents = [
      ...conversationHistory,
      {
        role: 'user' as const,
        parts: [{ text: message }],
      },
    ];

    const result = await genAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
    });

    const responseText = result.text || 'Sorry, I could not generate a response.';

    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message || 'Invalid request format' },
        { status: 400 },
      );
    }

    console.error('Error calling Gemini API:', error);

    // In development, return more detailed error information
    const errorMessage =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Oops! Something went wrong :(';

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
};
