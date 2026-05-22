// Utils/Auth.validate.ts
import { SignupDTO, LoginDTO } from "../DTO/Auth.dto";

export const validateSignup = (data: SignupDTO): string | null => {
  const { firstName, lastName, email, password, role } = data;

  if (!firstName || firstName.trim() === "")
    return "First name is required";

  if (!lastName || lastName.trim() === "")
    return "Last name is required";

  if (!email || email.trim() === "")
    return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return "Invalid email format";

  if (!password || password.length < 8)
    return "Password must be at least 8 characters";

  if (!role || role.trim() === "")
    return "Role is required";

  const validRoles = [
    "Property Manager",
    "Property Owner",
    "Real Estate Investor",
    "HOA Manager",
    "Other",
  ];
  if (!validRoles.includes(role))
    return "Invalid role selected";

  return null; // no error
};

export const validateLogin = (data: LoginDTO): string | null => {
  const { identifier, password } = data;

  if (!identifier || identifier.trim() === "")
    return "User ID or email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (identifier.includes("@") && !emailRegex.test(identifier))
    return "Invalid email format";

  if (!password || password.trim() === "")
    return "Password is required";

  return null;
};