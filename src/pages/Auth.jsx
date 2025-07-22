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
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader, ClipLoader } from "react-spinners";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const navigate = useNavigate();

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    checkSession();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSignUp = async (formData) => {
    setIsSignUpLoading(true);
    const {error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    setIsSignUpLoading(false);

    if (error) toast.error(error.message);
    else {
      toast.success(
        "Account successfully created please check email inbox for confirmation !",
      );
      setIsSignUp(false);
      reset();
    }
  };

  const handleLogin = async (formData) => {
    setIsLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    setIsLoginLoading(false);

    if (error) toast.error(error.message);
    else {
      toast.success("You are successfully logged in!");
      reset();
      navigate("/");
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    setIsGoogleLoading(false);

    if (error) toast.error(error.message);
  };

  return (
    <main className="flex h-screen w-full items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      {}{" "}
      {isSignUp ? (
        <Card className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Create a new Account
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Please fill the below details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleSignUp)}>
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
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="dark:text-gray-300">
                      Password
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
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
              </div>
              <Button
                type="submit"
                disabled={isSignUpLoading}
                className="mt-4 flex w-full cursor-pointer items-center justify-center bg-blue-600 font-medium text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50"
              >
                {isSignUpLoading ? (
                  <>
                    <ClipLoader size={18} color="#fff" />
                    Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
              <Button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isGoogleLoading}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 border border-gray-300 bg-white font-medium text-gray-800 shadow-sm transition duration-200 hover:bg-gray-100 disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <>
                    <BeatLoader
                      color="#4285F4"
                      size={8}
                      className="mr-2"
                      speedMultiplier={1.2}
                    />
                    Signing in with Google...
                  </>
                ) : (
                  <>
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    Continue with Google
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <p className="mt-4 pb-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <button
              className="ml-2 cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-400"
              onClick={toggleSignUp}
            >
              Sign In
            </button>
          </p>
        </Card>
      ) : (
        <Card className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Login to your account
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleLogin)}>
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
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="dark:text-gray-300">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
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
              </div>
              <Button
                type="submit"
                disabled={isLoginLoading}
                className="mt-4 flex w-full cursor-pointer items-center justify-center bg-blue-600 font-medium text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoginLoading ? (
                  <>
                    <ClipLoader size={18} color="#fff" className="mr-2" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              <Button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isGoogleLoading}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 border border-gray-300 bg-white font-medium text-gray-800 shadow-sm transition duration-200 hover:bg-gray-100 disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <>
                    <BeatLoader
                      color="#4285F4"
                      size={8}
                      className="mr-2"
                      speedMultiplier={1.2}
                    />
                    Signing in with Google...
                  </>
                ) : (
                  <>
                    <img
                      src="https://developers.google.com/identity/images/g-logo.png"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    Continue with Google
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <p className="mt-4 pb-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <button
              className="ml-2 cursor-pointer font-medium text-blue-600 hover:underline dark:text-blue-400"
              onClick={toggleSignUp}
            >
              Sign Up
            </button>
          </p>
        </Card>
      )}
    </main>
  );
};

export default Auth;
