// DTO/Auth.dto.ts

export interface SignupDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company?: string;
  role: string;
}

export interface LoginDTO {
  identifier: string;
  password: string;
}