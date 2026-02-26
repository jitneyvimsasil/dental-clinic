export interface IntakeFormData {
  name: string;
  phone: string;
  email: string;
  treatment: string;
  insurance: string;
  isNewPatient: boolean;
  urgency: "emergency" | "soon" | "routine";
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface IntakeResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isError?: boolean;
}

export const MAX_MESSAGE_LENGTH = 1000;
