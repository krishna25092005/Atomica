"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/actions/user.actions";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CircleCheckBig, AlertCircle, LoaderCircle, Mail } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const VerifyEmailPage: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (token) {
        try {
          await verifyEmail(token);
          setStatus("success");
        } catch (error) {
          console.error("Error verifying email:", error);
          setStatus("error");
        }
      } else {
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

              <h2 className="text-2xl font-bold text-foreground mb-2">
                {status === "loading" && "Verifying Email"}
                {status === "success" && "Email Verified!"}
                {status === "error" && "Verification Failed"}
              </h2>

              <p className="text-muted-foreground">
                {status === "loading" && "Please wait while we verify your email address..."}
                {status === "success" && "Your email has been successfully verified! You can now sign in to your account."}
                {status === "error" && "There was an error verifying your email. The token may be expired or invalid."}
              </p>
            </div>

            {status === "success" && (
              <AnimatedContainer className="space-y-4">
                <Button
                  onClick={() => router.push("/auth-page/signin")}
                  className="w-full"
                  size="lg"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Sign In Now
                </Button>
              </AnimatedContainer>
            )}

            {status === "error" && (
              <AnimatedContainer className="space-y-4">
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
          </Card>
        </AnimatedContainer>
      </div>
    </DefaultLayout>
  );
};

export default VerifyEmailPage;
