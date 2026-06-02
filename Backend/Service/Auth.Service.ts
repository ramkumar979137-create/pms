// Service/Auth.Service.ts
import { AppDataSource } from "../config/data-source";
import { User } from "../Entity/User";
import { SignupDTO, LoginDTO } from "../DTO/Auth.dto";

import { hashPassword, comparePassword } from "../Utils/Hash";
import jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);

/* ─────────────────────────────────────────
   SIGNUP
───────────────────────────────────────── */
export const registerUser = async (data: SignupDTO) => {
  console.log("Registering user with data:", data);
  const { firstName, lastName, email, password, company, role } = data;

  // Check existing user
  const existingUser = await userRepo.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Hash password
  console.log("Hashing password...");
  const hashedPassword = await hashPassword(password);
  console.log("1111111111111111111111111111Hashing password...");

  const user = userRepo.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    company:  company ?? "",
    role,
  });

  const savedUser = await userRepo.save(user);

  // Return without password
  const { password: _, ...userWithoutPassword } = savedUser;
  return userWithoutPassword;
};

/* ─────────────────────────────────────────
   LOGIN
───────────────────────────────────────── */
export const loginUser = async (data: LoginDTO) => {
  const { identifier, password } = data;

  // Find user by email or userId
  const user = await userRepo.findOne({
    where: [
      { email: identifier },
      { userId: identifier },
    ],
  });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // JWT Token
  const JWT_SECRET = process.env.JWT_SECRET || "secret";
  const token = jwt.sign({ id: user.id, email: user.email, userId: user.userId }, JWT_SECRET, { expiresIn: "1d" });

  // Return user and token
  const { password: _, ...userWithoutPassword } = user;
  return { ...userWithoutPassword, token };
};