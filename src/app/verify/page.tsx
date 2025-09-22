"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Facebook, Twitter } from "lucide-react";

// Reuse components
import BrandLogo from "@/components/auth/BrandLogo";
import Divider from "@/components/auth/Divider";
import SocialButton from "@/components/auth/SocialButton";
import SubmitButton from "@/components/auth/SubmitButton";
import OTPInput from "@/components/auth/OTPInput";

type VerifyForm = {
  otp: string;
};

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
              // Cho phép gõ dần (chỉ chữ số) và yêu cầu đủ length để hợp lệ
              validate: {
                digitsOnly: (v) => (/^\d*$/.test(v) ? true : "Digits only"),
                exactLength: (v) =>
                  v.length === length || `Code must be ${length} digits`,
              },
            }}
            render={({ field }) => {
              // Map string -> string[] cho OTPInput
              const valueArray = Array.from({ length }, (_, i) => field.value[i] ?? "");
              return (
                <OTPInput
                  length={length}
                  value={valueArray}
                  onChange={(arr) => {
                    // Chỉ nhận chữ số; RHF sẽ tự validate và cập nhật isValid
                    const joined = arr.join("");
                    if (/^\d*$/.test(joined)) {
                      field.onChange(joined);
                    }
                  }}
                  onComplete={(code) => {
                    // Khi đủ số lượng, gán thẳng cho field (RHF tự validate)
                    if (/^\d+$/.test(code)) {
                      field.onChange(code);
                    }
                  }}
                />
              );
            }}
          />

          {errors.otp && (
            <p className="mt-1 text-sm text-red-600 text-center">{errors.otp.message}</p>
          )}

          <SubmitButton disabled={!isValid}>Continue</SubmitButton>

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
