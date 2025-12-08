import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import AppError from "../utils/AppError";
import Token from "../models/Token";
import RefreshToken from "../models/RefreshToken";
import { randomBytes } from "crypto";
import { generateTokens, setTokenCookies } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth-middleware";

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password, fullname, bio } = req.body;

    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ email: email.toLowerCase() }),
      User.findOne({ username: username.toLowerCase() }),
    ]);

    if (existingEmail) {
      return next(new AppError("Bu email zaten kullanılıyor.", 409));
    }
    if (existingUsername) {
      return next(new AppError("Bu kullanıcı adı zaten alınmış.", 409));
    }

    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      fullname: fullname.trim(),
      bio: bio?.trim() || "",
    });

    const verificationToken = randomBytes(32).toString("hex");

    await Token.create({
      userId: newUser._id,
      token: verificationToken,
      type: "emailVerification",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Email mock
    try {
      console.log(
        `[MOCK EMAIL] Kime: ${newUser.email} | Token: ${verificationToken}`
      );
    } catch (emailError) {
      console.error("Email servisi hatası:", emailError);
      await Promise.all([
        User.findByIdAndDelete(newUser._id),
        Token.deleteOne({ userId: newUser._id, type: "emailVerification" }),
      ]);
      return next(
        new AppError("Kayıt sırasında bir hata oluştu (Email Servisi).", 500)
      );
    }

    res.status(201).json({
      success: true,
      message: "Kayıt Başarılı! Lütfen e-postanızı kontrol edin.",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullname: newUser.fullname,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Hatalı email veya şifre.", 401));
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
    });

    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "Giriş başarılı!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        profile_img: user.profile_img,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const me = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        profile_img_url: user.profile_img_url,
        role: user.role,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { register, login, me };
