// app/api/send-verification-email/route.ts

import { VerifyEmailTemplate } from "@/components/EmailTemplates/verify-email";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_KEY);

export async function POST(request: Request) {
  const { firstName, email, verificationUrl } = await request.json();

  try {
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';
    console.log(`📧 Attempting to send verification email to: ${email}`);
    console.log(`🔧 Development mode: ${isDevelopment}`);
    
    // For development, always log the verification URL
    if (isDevelopment) {
      console.log(`📧 Email verification for ${email}:`);
      console.log(`🔗 Verification URL: ${verificationUrl}`);
      console.log(`👤 User: ${firstName}`);
      
      // Return success response for development
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Verification email logged to console (development mode)',
        developmentMode: true 
      }), { status: 200 });
    }

    // Production email sending
    const { data, error } = await resend.emails.send({
      from: "Atomica <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your email address - Atomica",
      react: VerifyEmailTemplate({ firstName, verificationUrl }),
      // Add reply-to for better deliverability
      reply_to: ["support@yourdomain.com"], // Change this to your actual domain
    });

    if (error) {
      console.log('Resend error:', error);
      
      // If it's the testing restriction error, handle gracefully
      if (error.message && error.message.includes('You can only send testing emails')) {
        console.log(`📧 Email verification for ${email} (restricted by Resend testing mode):`);
        console.log(`🔗 Verification URL: ${verificationUrl}`);
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Email sending restricted in testing mode, but verification URL is available',
          testingMode: true 
        }), { status: 200 });
      }
      
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    console.log('✅ Email sent successfully:', data);
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Verification email sent successfully',
      data 
    }), { status: 200 });
  } catch (error: any) {
    console.log('Verification email error:', error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
