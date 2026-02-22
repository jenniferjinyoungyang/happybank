import React from 'react';
import { DefaultValues, FormProvider, UseFormProps, useForm } from 'react-hook-form';

/**
 * Generic form wrapper component for testing React Hook Form components.
 *
 * This wrapper provides form context to components that use `useFormContext`,
 * making it easy to test form components in isolation.
 *
 * @template TFormData - The type of form data
 *
 * @example
 * ```tsx
 * type MyFormData = {
 *   name: string;
 *   email: string;
 * };
 *
 * render(
 *   <FormWrapper<MyFormData> defaultValues={{ name: 'John', email: 'john@example.com' }}>
 *     <MyFormComponent />
 *   </FormWrapper>
 * );
 * ```
 */
export const FormWrapper = <TFormData extends Record<string, unknown>>({
  children,
  defaultValues,
  formOptions,
}: {
  children: React.ReactNode;
  defaultValues?: Partial<TFormData>;
  formOptions?: Omit<UseFormProps<TFormData>, 'defaultValues'>;
}) => {
  const methods = useForm<TFormData>({
    defaultValues: defaultValues as DefaultValues<TFormData>,
    ...formOptions,
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};
