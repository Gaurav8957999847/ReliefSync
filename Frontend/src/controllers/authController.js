import authService from "../services/authService.js";

const registerNgo = async (req, res, next) => {
  try {
    const { ngo, admin } = req.body;

    if (!ngo || !admin) {
      return res.status(400).json({
        success: false,
        message: "NGO and admin data are required",
      });
    }

    const result = await authService.registerNgo(ngo, admin);

    res.status(201).json({
      success: true,
      message: "NGO and Admin account created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await authService.login(email, password);

    res.json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Named exports as you wanted
export { registerNgo, login };
