// DynamicForm.tsx
import React, { useState } from 'react';

export type FormField = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'password';
  placeholder?: string;
  required?: boolean;
};

type DynamicFormProps = {
  fields: FormField[];
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  submitLabel?: string;
  submitting?: boolean;
};

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = 'Submit',
  submitting = false,
}) => {
  const [formValues, setFormValues] = useState<Record<string, unknown>>(initialValues);

  const handleChange = (name: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}{field.required && '*'}
            </label>
            <input
              type={field.type || 'text'}
              placeholder={field.placeholder || ''}
              required={field.required || false}
              value={formValues[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        ))}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {submitLabel}...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
