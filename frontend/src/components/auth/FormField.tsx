import React from "react";

type FormFieldProps = {
  label: string;
  id?: string;
  name?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
  className?: string;
};

export default function FormField({
  label,
  id,
  name,
  type = "text",
  value = "",
  placeholder = "",
  required = false,
  onChange,
  className = "",
}: FormFieldProps) {
  const fieldId = id ?? name ?? label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div>
      <label className="mt-3 block text-sm font-medium" htmlFor={fieldId}>
        {label}
        <input
          className={`mt-2 p-2 text-base w-full border border-amber-600 rounded-md outline-none ${className}`}
          type={type}
          id={fieldId}
          name={name}
          value={value}
          placeholder={placeholder}
          required={required}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
