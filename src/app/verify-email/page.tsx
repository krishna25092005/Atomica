"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/actions/user.actions";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CircleCheckBig, AlertCircle, LoaderCircle, Mail, Info } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const VerifyEmailPage: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error" | "info">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [infoMessage, setInfoMessage] = useState<string>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const message = searchParams.get("message");
  const router = useRouter();
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const verifyUserEmail = async () => {
      // Handle special messages first
      if (message === "check-email") {
        setStatus("info");
        setInfoMessage("Please check your email for a verification link. If you don't see it, check your spam folder.");
        return;
      }
      
      if (message === "dev-mode" && token) {
        setStatus("info");
        setInfoMessage("Your account was created successfully! In development mode, the verification link was logged to the console. You can verify your email using the button below.");
        return;
      }
      
      if (message === "email-failed" && token) {
        setStatus("info");
        setInfoMessage("Your account was created successfully, but we couldn't send the verification email. You can try manual verification below.");
        return;
      }

      if (!token) {
        setStatus("error");
        setErrorMessage("No verification token provided");
        return;
      }

      try {
        const result = await verifyEmail(token);
        
        if (result && result.success) {
          setStatus("success");
        } else {
          console.error("Email verification failed:", result?.message);
          setStatus("error");
          setErrorMessage(result?.message || "Verification failed");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus("error");
        setErrorMessage("An unexpected error occurred");
      }
    };

    verifyUserEmail();
  }, [token, message]);

  const handleManualVerification = async () => {
    if (!token) return;
    
    setStatus("loading");
    try {
      const result = await verifyEmail(token);
      if (result && result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result?.message || "Manual verification failed");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Manual verification failed");
    }
  };

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const result = await verifyEmail(token);
        
        if (result && result.success) {
          setStatus("success");
        } else {
          console.error("Email verification failed:", result?.message);
          setStatus("error");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus("error");
      }
    };

    verifyUserEmail();
  }, [token]);

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <AnimatedContainer className="w-full max-w-md">
          <Card className="p-8 text-center">
            <div className="mb-8">
              {status === "loading" && (
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <LoaderCircle className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              {status === "success" && (
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CircleCheckBig className="w-8 h-8 text-white" />
                </div>
              )}
              {status === "error" && (
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              )}
              {status === "info" && (
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
              )}

              <h2 className="text-2xl font-bold text-foreground mb-2">
                {status === "loading" && "Verifying Email"}
                {status === "success" && "Email Verified!"}
                {status === "error" && "Verification Failed"}
                {status === "info" && "Check Your Email"}
              </h2>

              <p className="text-muted-foreground">
                {status === "loading" && "Please wait while we verify your email address..."}
                {status === "success" && "Your email has been successfully verified! You can now sign in to your account."}
                {status === "info" && infoMessage}
                {status === "error" && (
                  <>
                    There was an error verifying your email: {errorMessage}
                    {isDevelopment && token && (
                      <span className="block mt-2 text-sm">
                        <strong>Development Token:</strong> {token}
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>

            {(status === "success" || status === "info") && (
              <AnimatedContainer className="space-y-4">
                <Button
                  onClick={() => router.push("/auth-page/signin")}
                  className="w-full"
                  size="lg"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {status === "success" ? "Sign In Now" : "Go to Sign In"}
                </Button>
              </AnimatedContainer>
            )}

            {status === "error" && (
              <AnimatedContainer className="space-y-4">
                {isDevelopment && token && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-medium">Development Mode</p>
                        <p>You can try manual verification if the automatic process failed.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {isDevelopment && token && (
                  <Button
                    onClick={handleManualVerification}
                    className="w-full mb-2"
                    size="lg"
                  >
                    Try Manual Verification
                  </Button>
                )}
                
                <Button
                  onClick={() => router.push("/auth-page/signin")}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Back to Sign In
                </Button>
              </AnimatedContainer>
            )}

            {status === "info" && token && (
              <AnimatedContainer className="space-y-4 mt-4">
                <Button
                  onClick={handleManualVerification}
                  className="w-full"
                  size="lg"
                >
                  Verify Email Manually
                </Button>
              </AnimatedContainer>
            )}
          </Card>
        </AnimatedContainer>
      </div>
    </DefaultLayout>
  );
};

export default VerifyEmailPage;
