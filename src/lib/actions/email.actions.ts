export async function sendVerificationEmail(
  email: string,
  firstName: string,
  verificationUrl: string,
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/send-verification-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, firstName, verificationUrl }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to send verification email");
    }

    return data;
  } catch (error: any) {
    console.error('Email verification error:', error);
    // Don't throw the error, return a result object instead
    return {
      success: false,
      error: error.message || "Failed to send verification email"
    };
  }
}

export async function sendResetPasswordEmail(
  email: string,
  firstName: string,
  resetUrl: string,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/send-reset-password-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, firstName, resetUrl }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to send reset password email");
  }

  return data;
}
