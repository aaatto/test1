// File: app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Import Prisma client instance
import bcrypt from 'bcryptjs'; // Import password hashing library
import { z } from 'zod'; // Import Zod for validation

// Define the expected schema for the request body using Zod
const registerSchema = z.object({
  name: z.string().optional(), // Name is optional
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

// Handler for POST requests to /api/auth/register
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body against the schema
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validation.error.flatten().fieldErrors },
        { status: 400 } // Bad Request
      );
    }

    const { name, email, password } = validation.data;

    // Check if user with this email already exists
    const existingUser = await db.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 } // Conflict
      );
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create the new user in the database
    const newUser = await db.user.create({
      data: {
        name: name || null, // Use null if name is not provided
        email: email,
        password: hashedPassword,
        // Prisma schema sets default credits to 0
      },
    });

    // Return a success response (don't send back the password hash)
    // We only need to signal success; the form will handle login separately
    return NextResponse.json(
        { message: 'User registered successfully', userId: newUser.id },
        { status: 201 } // Created
    );

  } catch (error) {
    console.error('Registration API Error:', error);
    // Generic error for unexpected issues
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
