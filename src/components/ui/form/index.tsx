'use client';

import * as React from 'react';

import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import cn from '@/lib/classnames';

import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';

import { Label } from 'components/ui/label';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
  /** Whether a <FormDescription> is mounted inside this item. */
  hasDescription: boolean;
  registerDescription: () => void;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId();
  const [hasDescription, setHasDescription] = React.useState(false);

  const value = React.useMemo(
    () => ({ id, hasDescription, registerDescription: () => setHasDescription(true) }),
    [id, hasDescription]
  );

  return (
    <FormItemContext.Provider value={value}>
      <div data-slot="form-item" className={cn('grid gap-2', className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('mb-1 block text-black/85 data-[error=true]:text-red-700', className)}
      htmlFor={formItemId}
      {...props}
    >
      {children}
      {required && (
        <>
          {' '}
          <span title="required field" aria-label="required field">
            *
          </span>
        </>
      )}
    </Label>
  );
}

/**
 * Optional helper text for a field.
 *
 * `FormControl` points `aria-describedby` at this element's id. Until this
 * component existed, that id referenced nothing at all, so every field in the
 * app advertised a description that no assistive technology could resolve.
 */
function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField();
  const { registerDescription } = React.useContext(FormItemContext);

  React.useEffect(() => {
    registerDescription();
  }, [registerDescription]);

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-sm text-black/60', className)}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  const itemContext = React.useContext(FormItemContext);

  // Only advertise the ids that actually exist in the DOM. A dangling
  // aria-describedby is worse than none: screen readers announce nothing but
  // the field looks correctly described to automated checks.
  const describedBy =
    [itemContext.hasDescription ? formDescriptionId : null, error ? formMessageId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={describedBy}
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-sm text-red-700', className)}
      {...props}
    >
      {body}
    </p>
  );
}

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };
