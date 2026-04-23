import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userRepository from "../repositories/userRepository.js";
import ngoRepository from "../repositories/ngoRepository.js";

const JWT_SECRET = process.env.JWT_SECRET;

class AuthService {
  // this is for creation of the ngo and the user of the ngo
  async registerNgo(ngoData, adminData) {
    // Check if NGO already exists
    const existingNgo = await ngoRepository.findByEmail(ngoData.email);
    if (existingNgo) throw new Error("NGO with this email already exists");

    const ngo = await ngoRepository.create(ngoData);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    const admin = await userRepository.create({
      ...adminData,
      password: hashedPassword,
      role: "admin",
      ngoId: ngo._id,
    });

    // Update NGO with createdBy
    ngo.createdBy = admin._id;
    await ngo.save();

    const token = jwt.sign(
      { id: admin._id, role: "admin", ngoId: ngo._id },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return { ngo, admin, token };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.isActive) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, role: user.role, ngoId: user.ngoId._id },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return { user, token };
  }

  verifyToken(token) {
    if (!token) throw new Error("No token provided");
    return jwt.verify(token, JWT_SECRET);
  }
}

export default new AuthService();
