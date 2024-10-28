const userService = require("../services/userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthController {
    async login(req, res) {
        const { email, password } = req.body;
        
        try {
            const user = await userService.getUserByEmail(email);
            if (!user) {
                return res.status(401).json({ message: "Email ou senha incorretos" });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: "Email ou senha incorretos" });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,  
                { expiresIn: "3h" }
            );

            res.status(200).json({ token, id: user.id, role: user.role });
        } catch (error) {
            res.status(500).json({ message: "Erro no login", error });
        }
    }
}

module.exports = new AuthController();
