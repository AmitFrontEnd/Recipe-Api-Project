import React, { useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.replace("#", "?"));
    const token = urlParams.get("access_token");
    const type = urlParams.get("type");
    if (!token || type !== "recovery") {
      navigate("/");
    }
  }, []);

  const handleResetPassword = async (formData) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });
      if (error) throw error;
      await supabase.auth.signOut();
      toast.success("Password updated successfully! Please sign in.");
      reset();
      navigate("/auth");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className="flex h-screen w-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <Card className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Set New Password
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleResetPassword)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password" className="dark:text-gray-300">
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  className="transition duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 font-medium text-white transition duration-200 hover:bg-blue-700"
              >
                Update Password
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

export default ResetPassword;
