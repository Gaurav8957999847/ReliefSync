import authService from "../services/authService.js";

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    const decoded = authService.verifyToken(token);
    req.user = decoded; // { id, role, ngoId }
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};

export default protect;
