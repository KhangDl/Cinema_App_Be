import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ LOGIN
export const login = async (req, res) => {
    console.log("LOGIN BODY:", req.body);

  try {
    const email = req.body?.email?.toLowerCase()?.trim();
    const password = req.body?.password?.trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login OK",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const name = req.body?.name?.trim();
    const email = req.body?.email?.toLowerCase()?.trim();
    const password = req.body?.password?.trim();
    const phone = req.body?.phone?.trim() || "";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin!" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "user"
    });

    // auto login sau khi đăng ký
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Đăng ký thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    return res.status(500).json({ message: err.message });
  }
};
