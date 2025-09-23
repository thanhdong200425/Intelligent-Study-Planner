"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Facebook, Twitter } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import BrandLogo from "@/components/auth/BrandLogo";
import Divider from "@/components/auth/Divider";
import SocialButton from "@/components/auth/SocialButton";
import SubmitButton from "@/components/auth/SubmitButton";
import InputWithIcon from "@/components/auth/InputWithIcon";
import PasswordField from "@/components/auth/PasswordField";
import CheckboxField from "@/components/auth/CheckboxField";

type FormValues = { email: string; password: string; remember: boolean };

export default function AuthPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async (data: FormValues) => {
    
    console.log("payload:", data);
    
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6">
      <AuthCard>
        <BrandLogo />
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
          Login Or Sign Up
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6" noValidate>
          {/* Email */}
          <InputWithIcon
            id="email"
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            // truyền toàn bộ props từ register xuống input bên trong
            register={register("email", {
              required: "Please enter your email.",
              pattern: { value: /.+@.+\..+/, message: "Email format looks invalid." },
              setValueAs: (v) =>
                typeof v === "string" ? v.trim().toLowerCase() : v,
            })}
            error={errors.email?.message}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600">
              {errors.email.message}
            </p>
          )}

          {/* Password */}
          <PasswordField
            autoComplete="current-password"
            register={register("password", {
              required: "Please enter your password.",
              minLength: { value: 8, message: "Password must be at least 8 characters." },
            })}
            error={errors.password?.message}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-600">
              {errors.password.message}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <CheckboxField id="remember" label="Remember Me" register={register("remember")} />
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Forgot Password
            </a>
          </div>

          <SubmitButton disabled={!isValid || isSubmitting}>
            {isSubmitting ? "Processing..." : "Continue"}
          </SubmitButton>

          <Divider label="OR" />

          <div className="space-y-3">
            <SocialButton
              icon={<Facebook size={18} />}
              ariaLabel="Sign in with Facebook"
              onClick={() => console.log("Facebook")}
              type="button"
            >
              Sign In With Facebook
            </SocialButton>
            <SocialButton
              icon={<Twitter size={18} />}
              ariaLabel="Sign in with Twitter"
              onClick={() => console.log("Twitter")}
              type="button"
            >
              Sign In With Twitter
            </SocialButton>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}
