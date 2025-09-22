"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Facebook, Twitter } from "lucide-react";

// Reuse components
import BrandLogo from "@/components/auth/BrandLogo";
import Divider from "@/components/auth/Divider";
import SocialButton from "@/components/auth/SocialButton";
import SubmitButton from "@/components/auth/SubmitButton";

// HeroUI
import { InputOtp } from "@heroui/react";

// Import classNames tách riêng
import { otpClassNames } from "@/components/auth/OtpStyles";

type VerifyForm = { otp: string };

export default function VerifyCodePage({
  email = "abc@gmail.com",
  length = 6,
}: {
  email?: string;
  length?: number;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<VerifyForm>({
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  const onSubmit = (data: VerifyForm) => {
    console.log("Verify code:", data.otp);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur shadow-xl border border-slate-200 p-8">
        <BrandLogo />

        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-slate-900 text-center">
            Please Check Your Email
          </h1>
          <p className="mt-4 text-slate-600 text-center">
            We’ve sent a code to <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full space-y-6" noValidate>
          <Controller
            name="otp"
            control={control}
            rules={{
              required: "Please enter the code",
              validate: {
                digitsOnly: (v) => (/^\d*$/.test(v) ? true : "Digits only"),
                exactLength: (v) => v.length === length || `Code must be ${length} digits`,
              },
            }}
            render={({ field }) => (
              <InputOtp
                length={length}
                value={field.value}
                onValueChange={field.onChange}
                onComplete={(val) => field.onChange(val)}
                pushPasswordManagerStrategy="none"
                isInvalid={!!errors.otp}
                errorMessage={errors.otp?.message}
                classNames={otpClassNames} // ✅ dùng lại từ file riêng
              />
            )}
          />

          <SubmitButton disabled={!isValid} aria-label="Continue">
            Continue
          </SubmitButton>

          <Divider label="OR" />

          <div className="space-y-3">
            <SocialButton
              icon={<Facebook size={18} />}
              onClick={() => console.log("Facebook auth")}
              ariaLabel="Sign in with Facebook"
            >
              Sign In With Facebook
            </SocialButton>

            <SocialButton
              icon={<Twitter size={18} />}
              onClick={() => console.log("Twitter auth")}
              ariaLabel="Sign in with Twitter"
            >
              Sign In With Twitter
            </SocialButton>
          </div>
        </form>
      </div>
    </div>
  );
}
