import React from "react";

type FormFieldProps = {
  label: string;
  id: string;
  type?: string;
  value: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FormField({
  label,
  id,
  type = "text",
  value,
  required = false,
  onChange,
}: FormFieldProps) {
  return (
    <div>
      <label className="mt-3 block text-sm font-medium" htmlFor={id}>
        {label}
        <input
          className="mt-2 p-2 text-base w-full border border-amber-600 rounded-md outline-none"
          type={type}
          id={id}
          value={value}
          required={required}
          onChange={onChange}
        />
      </label>
    </div>
  );
}
