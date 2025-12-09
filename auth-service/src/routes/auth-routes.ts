import { Router } from "express";
import {
  register,
  login,
  me,
  refreshToken,
  logout,
} from "../controllers/authController";
import validate from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators/auth-validation";
import { protect } from "../middleware/auth-middleware";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, me);
router.post("/logout", logout);

router.post("/refresh-token", refreshToken);

export default router;
