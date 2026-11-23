/**
 * Best-effort human message from an Axios/fetch-style API error.
 * Handles `{ error }`, `{ message }` and Rails/Devise `{ errors: { field: [msg] } }`
 * or `{ errors: [msg] }` bodies, falling back to `fallback`.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const data = (error as { response?: { data?: any } })?.response?.data;
  if (!data) return fallback;

  if (typeof data.error === 'string' && data.error) return data.error;
  if (typeof data.message === 'string' && data.message) return data.message;

  const { errors } = data;
  if (Array.isArray(errors) && errors.length) {
    const first = errors[0];
    return typeof first === 'string' ? first : (first?.title ?? first?.detail ?? fallback);
  }
  if (errors && typeof errors === 'object') {
    const [field, messages] = Object.entries(errors)[0] ?? [];
    const message = Array.isArray(messages) ? messages[0] : messages;
    if (field && typeof message === 'string') return `${field.replace(/_/g, ' ')} ${message}`;
  }

  return fallback;
}
