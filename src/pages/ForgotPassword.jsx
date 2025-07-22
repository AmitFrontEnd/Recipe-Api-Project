import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleResetPassword = async (formData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: "http://localhost:5173/reset-password",
        },
      );
      if (error) throw error;
      toast.success("Password reset email sent! Check your inbox.");
      reset();
    } catch  {
      toast.success("If the email exists, a reset link has been sent.");
    }
    setLoading(false);
  };

  return (
    <main className="flex h-screen w-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <Card className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleResetPassword)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="dark:text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="transition duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center bg-blue-600 font-medium text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <ClipLoader color="#bbe7e2" size={20} />
                    Sending
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </form>
          <p className="mt-4 pb-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Back to{" "}
            <Link
              to="/auth"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default ForgotPassword;
