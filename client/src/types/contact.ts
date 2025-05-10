export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormState {
  loading: boolean;
  success: boolean | null;
  error: string | null;
} 