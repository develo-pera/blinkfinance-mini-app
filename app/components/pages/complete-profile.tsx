"use client";

import { useRef, useState } from "react";
import { Context } from "@farcaster/miniapp-sdk";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Address } from "viem";
import { toast } from "sonner";
import * as yup from "yup";
import { ActivePage } from "@/app/page";

// Validation schema
const profileSchema = yup.object({
  displayName: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
});

const CompleteProfilePage = ({ user, address, setLoadingState, refetchUser, setActivePage }: { user?: Context.UserContext, address?: Address, setLoadingState: (loadingState: boolean) => void, refetchUser: () => void, setActivePage: (page: ActivePage) => void }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  // Real-time validation function
  const validateField = async (fieldName: string, value: string) => {
    try {
      await profileSchema.validateAt(fieldName, { [fieldName]: value });
      // Clear error if validation passes
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error.message
        }));
      }
    }
  };

  // Handle input change
  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Validate the field in real-time
    validateField(fieldName, value);
  };

  const handleCompleteProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoadingState(true);

    try {
      // Final validation before submission
      await profileSchema.validate(formData, { abortEarly: false });

      // If validation passes, submit the form
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          fid: user?.fid || undefined,
          walletAddress: address,
        }),
      });

      const data = await response.json();
      console.log("complete profile data", data);

      if (response.ok) {
        toast.success("Profile completed successfully");
        // Reset form data
        setFormData({
          displayName: "",
          email: "",
        });
        setErrors({});
        refetchUser();
        setActivePage("profile");
      } else {
        toast.error(data.error || "Failed to complete profile");
      }
    } catch (error) {
      console.error(error);

      if (error instanceof yup.ValidationError) {
        // Handle validation errors (shouldn't happen with real-time validation)
        const validationErrors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);
        toast.error("Please fix the validation errors");
      } else {
        toast.error("Failed to complete profile");
      }
    }

    setIsSubmitting(false);
    setLoadingState(false);
  };

  return (
    <div className="px-4 flex flex-col flex-1">
      <div className="mt-5">
        <h1 className="text-2xl font-bold">Complete Profile</h1>
        <p className="mt-3 text-sm text-gray-500">Please complete your profile to start using Blink Finance.</p>
      </div>
      <form onSubmit={handleCompleteProfile} ref={formRef} className="mt-10 space-y-2">
        <div>
          <Input
            value={formData.displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            type="text"
            placeholder="Name"
            className={`w-full ${errors.displayName ? 'border-red-500' : ''}`}
          />
          {errors.displayName && (
            <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>
          )}
        </div>

        <div>
          <Input
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            type="email"
            placeholder="Email"
            className={`w-full ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* <Input type="text" placeholder="Company Name" className="w-full" />
        <Input type="text" placeholder="Company VAT" className="w-full" />
        <Input type="text" placeholder="Company Reg. No" className="w-full" />
        <Input type="text" placeholder="Company Address" className="w-full" />
        <Input type="text" placeholder="Company City" className="w-full" />
        <Input type="text" placeholder="Company Country" className="w-full" />
        <Input type="text" placeholder="Company Zip" className="w-full" /> */}
        <Button className={"mt-5 w-full rounded-xl bg-[var(--bf-card-background)] text-foreground"} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Profile"}
        </Button>
      </form>
    </div>
  );
};

export default CompleteProfilePage;