export interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
