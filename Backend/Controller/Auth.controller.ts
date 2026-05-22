// Controller/Auth.controller.ts
import { Request, Response } from "express";
import { registerUser, loginUser } from "../Service/Auth.Service";
import { validateSignup, validateLogin } from "../Utils/Auth.validate";
import { SignupDTO, LoginDTO } from "../DTO/Auth.dto";

/* ─────────────────────────────────────────
   SIGNUP
───────────────────────────────────────── */
export const signup = async (req: Request, res: Response) => {
  try {
    const body = req.body as SignupDTO;

    // Validate
    const validationError = validateSignup(body);
    if (validationError) {
      res.status(422).json({ message: validationError });
      return;
    }

    const user = await registerUser(body);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/* ─────────────────────────────────────────
   LOGIN
───────────────────────────────────────── */
export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body as LoginDTO;

    // Validate
    const validationError = validateLogin(body);
    if (validationError) {
      res.status(422).json({ message: validationError });
      return;
    }

    const user = await loginUser(body);

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error: any) {
    res.status(401).json({
      message: error.message,
    });
  }
};