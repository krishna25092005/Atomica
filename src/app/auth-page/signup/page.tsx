"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { createUser } from "@/lib/actions/user.actions";
import {
  CameraIcon,
  LoaderCircle,
  LockIcon,
  MailIcon,
  UserIcon,
  CheckIcon,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const SignUp: React.FC = () => {
  const [user, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    photo: "",
    userBio: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    
    if (file) {
      // Check file size (limit to 2MB)
      const maxSizeInMB = 2;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      
      if (file.size > maxSizeInBytes) {
        setErrors(`Image size must be less than ${maxSizeInMB}MB. Please choose a smaller image.`);
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors('Please upload a valid image file (JPEG, PNG, or WebP).');
        return;
      }
      
      setErrors(null);
      setImageFile(file);
    }
  };

  const compressImage = (file: File, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img') as HTMLImageElement;
      
      img.onload = () => {
        // Calculate new dimensions (max 400x400)
        const maxDimension = 400;
        let { width, height } = img;
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const convertImageToBase64 = async (file: File): Promise<string> => {
    try {
      // First compress the image
      const compressedBase64 = await compressImage(file, 0.7);
      
      // Check if compressed image is still too large (target: under 500KB base64)
      const sizeInBytes = (compressedBase64.length * 3) / 4;
      if (sizeInBytes > 500000) { // 500KB limit
        // Compress further if still too large
        return await compressImage(file, 0.5);
      }
      
      return compressedBase64;
    } catch (error) {
      console.error('Error compressing image:', error);
      // Fallback to original conversion if compression fails
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setIsLoading(true);

    // Basic form validation
    if (!user.email || !user.firstName || !user.lastName || !user.password) {
      setErrors("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (user.password !== user.confirmPassword) {
      setErrors("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      let base64Image = "";
      if (imageFile) {
        base64Image = await convertImageToBase64(imageFile);
      }

      const newUser = { ...user, photo: base64Image };
      const result = await createUser(newUser);

      if (result.success) {
        // Handle successful signup
        console.log("User created successfully:", result.user);
        console.log("Email status debug:", result.emailStatus);
        
        // Check email status and provide appropriate feedback
        if (result.emailStatus && result.emailStatus.success && !result.emailStatus.developmentMode) {
          // Email sent successfully in production
          console.log("Redirecting to check-email");
          window.location.href = "/verify-email?message=check-email";
        } else {
          // User created but email couldn't be sent OR we're in development mode
          console.log("Email sending issue:", result.emailStatus?.message);
          console.log("Development mode:", result.emailStatus?.developmentMode);
          // Always redirect to verification page with token for development/testing
          if (result.user && result.user._id) {
            const message = result.emailStatus?.developmentMode ? "dev-mode" : "email-failed";
            console.log(`Redirecting to verify-email with token and message: ${message}`);
            window.location.href = `/verify-email?token=${result.user._id}&message=${message}`;
          } else {
            console.log("Redirecting to signin");
            window.location.href = "/auth-page/signin?message=signup-success";
          }
        }
      } else {
        setErrors(result.message || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setErrors("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!user.firstName || !user.lastName || !user.email) {
        setErrors("Please fill in all required fields.");
        return;
      }
    }
    setErrors(null);
    setStep(step + 1);
  };

  const prevStep = () => {
    setErrors(null);
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-boxdark-2 dark:via-boxdark dark:to-boxdark-2 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            Join Atomica
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account and start your research journey
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    i <= step
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                  }`}
                >
                  {i < step ? <CheckIcon size={20} /> : i}
                </div>
                {i < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      i < step ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Step {step} of 3
            </p>
          </div>
        </div>

        {/* Sign Up Form */}
        <Card variant="elevated" className="p-8">
          {errors && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{errors}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                    Personal Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Let's get to know you better
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    leftIcon={<UserIcon size={20} />}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    leftIcon={<UserIcon size={20} />}
                    required
                  />
                </div>

                <Input
                  type="email"
                  label="Email Address"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  leftIcon={<MailIcon size={20} />}
                  required
                />

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={nextStep}
                >
                  Continue
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                    Account Security
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create a secure password
                  </p>
                </div>

                <Input
                  type="password"
                  label="Password"
                  name="password"
                  value={user.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  leftIcon={<LockIcon size={20} />}
                  helperText="Must be at least 8 characters with uppercase, lowercase, and number"
                  required
                />

                <Input
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  leftIcon={<LockIcon size={20} />}
                  required
                />

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={nextStep}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                    Profile Setup
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete your profile (optional)
                  </p>
                </div>

                {/* Profile Photo */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {imageFile ? (
                        <Image
                          src={URL.createObjectURL(imageFile)}
                          alt="Profile"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon size={32} className="text-gray-400" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                      <CameraIcon size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Upload a profile photo (max 2MB, JPEG/PNG/WebP)
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    name="userBio"
                    value={user.userBio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself and your research interests..."
                    className="w-full p-3 border border-stroke dark:border-strokedark rounded-lg bg-white dark:bg-form-input text-black dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth-page/signin"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
