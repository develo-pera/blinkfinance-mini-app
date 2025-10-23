"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { ActivePage } from "@/app/page";
import { Input } from "@/components/ui/input";
import { IUser } from "@/models/User";
import { ICompany } from "@/models/Company";

const companySchema = yup.object({
  name: yup.string().required("Name is required"),
  taxId: yup.string().max(50, "Tax ID must be less than 50 characters").required("Tax ID is required"),
  registrationNumber: yup.string().max(50, "Registration number must be less than 50 characters").required("Registration number is required"),
  address: yup.object({
    street: yup.string().max(200, "Street must be less than 200 characters").required("Street is required"),
    city: yup.string().max(100, "City must be less than 100 characters").required("City is required"),
    country: yup.string().max(100, "Country must be less than 100 characters").required("Country is required"),
    state: yup.string().max(100, "State must be less than 100 characters").required("State is required"),
    zipCode: yup.string().max(20, "Zip code must be less than 20 characters").required("Zip code is required"),
  }),
});

// Individual field schemas for real-time validation
const fieldSchemas = {
  name: yup.string().required("Name is required"),
  taxId: yup.string().max(50, "Tax ID must be less than 50 characters").required("Tax ID is required"),
  registrationNumber: yup.string().max(50, "Registration number must be less than 50 characters").required("Registration number is required"),
  "address.street": yup.string().max(200, "Street must be less than 200 characters").required("Street is required"),
  "address.city": yup.string().max(100, "City must be less than 100 characters").required("City is required"),
  "address.country": yup.string().max(100, "Country must be less than 100 characters").required("Country is required"),
  "address.state": yup.string().max(100, "State must be less than 100 characters").required("State is required"),
  "address.zipCode": yup.string().max(20, "Zip code must be less than 20 characters").required("Zip code is required"),
};

const EditCompanyPage = ({
  userData,
  companyData,
  setLoadingState,
  refetchCompany,
  setActivePage
}: {
  userData: IUser,
  companyData: ICompany,
  setLoadingState: (loadingState: boolean) => void,
  refetchCompany: () => void,
  setActivePage: (page: ActivePage) => void
}) => {
  const [formData, setFormData] = useState({
    name: companyData?.name || "",
    taxId: companyData?.taxId || "",
    registrationNumber: companyData?.registrationNumber || "",
    address: companyData?.address || {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // TODO: repeated code for validation, should be refactored
  // Real-time validation function
  const validateField = async (fieldName: string, value: string) => {
    try {
      // Use individual field schema for validation
      const fieldSchema = fieldSchemas[fieldName as keyof typeof fieldSchemas];
      if (fieldSchema) {
        await fieldSchema.validate(value);
        // Clear error if validation passes
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error.message
        }));
      }
    }
  };

  // TODO: repeated code for input change, should be refactored
  // Handle input change
  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => {
      // Handle nested address fields
      if (fieldName.startsWith('address.')) {
        const addressField = fieldName.split('.')[1];
        return {
          ...prev,
          address: {
            ...prev.address,
            [addressField]: value
          }
        };
      } else {
        return {
          ...prev,
          [fieldName]: value
        };
      }
    });

    // Validate the field in real-time
    validateField(fieldName, value);
  };

  const handleEditCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingState(true);
    setIsSubmitting(true);
    try {
      await companySchema.validate(formData, { abortEarly: false });
      const response = await fetch(`/api/user/${userData?.id}/company`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bf-token")}`,
        },
        body: JSON.stringify({
          ...formData,
          ownerId: userData?.id,
        }),
      });
      const data = await response.json();
      console.log("edit company data", data);
      if (response.ok) {
        toast.success("Company updated successfully");
        refetchCompany();
        setActivePage("profile");
      } else {
        toast.error(data.error || "Failed to update company");
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
        // toast.error("Please fix the validation errors");
      } else {
        toast.error("Failed to update company");
      }
    }
    setIsSubmitting(false);
    setLoadingState(false);
  };

  return (
    <div className="px-4 flex flex-col flex-1">
      <div className="mt-5">
        <h1 className="text-2xl font-bold">Edit Company</h1>
      </div>
      <form onSubmit={handleEditCompany} ref={formRef} className="mt-10 space-y-2">
        {/* // TODO: Add logo input */}
        <div>
          <Input
            type="text"
            placeholder="Company Name"
            className={`w-full ${errors.name ? 'border-red-500' : ''}`}
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Company VAT"
            className={`w-full ${errors.taxId ? 'border-red-500' : ''}`}
            value={formData.taxId}
            onChange={(e) => handleInputChange("taxId", e.target.value)}
          />
          {errors.taxId && (
            <p className="text-red-500 text-sm mt-1">{errors.taxId}</p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Company Reg. No"
            className={`w-full ${errors.registrationNumber ? 'border-red-500' : ''}`}
            value={formData.registrationNumber}
            onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
          />
          {errors.registrationNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.registrationNumber}</p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Company Country"
            className={`w-full ${errors["address.country"] ? 'border-red-500' : ''}`}
            value={formData.address?.country}
            onChange={(e) => handleInputChange("address.country", e.target.value)}
          />
          {errors["address.country"] && (
            <p className="text-red-500 text-sm mt-1">{errors["address.country"]}</p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Company Address"
            className={`w-full ${errors["address.street"] ? 'border-red-500' : ''}`}
            value={formData.address?.street}
            onChange={(e) => handleInputChange("address.street", e.target.value)}
          />
          {errors["address.street"] && (
            <p className="text-red-500 text-sm mt-1">{errors["address.street"]}</p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Company City"
            className={`w-full ${errors["address.city"] ? 'border-red-500' : ''}`}
            value={formData.address?.city}
            onChange={(e) => handleInputChange("address.city", e.target.value)}
          />
          {errors["address.city"] && (
            <p className="text-red-500 text-sm mt-1">{errors["address.city"]}</p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Company State"
            className={`w-full ${errors["address.state"] ? 'border-red-500' : ''}`}
            value={formData.address?.state}
            onChange={(e) => handleInputChange("address.state", e.target.value)}
          />
          {errors["address.state"] && (
            <p className="text-red-500 text-sm mt-1">{errors["address.state"]}</p>
          )}
        </div>
        <div>
          <Input
            type="text"
            placeholder="Company Zip"
            className={`w-full ${errors["address.zipCode"] ? 'border-red-500' : ''}`}
            value={formData.address?.zipCode}
            onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
          />
          {errors["address.zipCode"] && (
            <p className="text-red-500 text-sm mt-1">{errors["address.zipCode"]}</p>
          )}
        </div>
        <Button className="mt-5 w-full rounded-xl bg-foreground text-background" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
      <Button onClick={() => setActivePage("profile")} className="mt-auto w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">Go back to profile</Button>
    </div>
  );
};

export default EditCompanyPage;