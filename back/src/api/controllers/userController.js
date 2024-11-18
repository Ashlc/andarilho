const userService = require("../services/userService");
const bcrypt = require("bcrypt");

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            const sanitizedUsers = users.map(({ password, ...rest }) => rest);
            res.status(200).json(sanitizedUsers);
        } catch (error) {
            res.status(500).json({ message: "Error fetching users", error });
        }
    }

    async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await userService.getUserById(id);
            const sanitizedUser = { ...user, password: undefined };
            if (!user) {
                res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(sanitizedUser);
        } catch (error) {
            res.status(500).json({ message: "Error fetching user", error });
        }
    }

    async createUser(req, res) {
        const { email, password, role } = req.body;
        try {
            if (password.length < 8) {
                return res.status(400).json({ message: "A senha deve ter pelo menos 8 dígitos." });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await userService.createUser({
                email,
                password: hashedPassword,
                role,
            });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ message: "Error creating user", error });
        }
    }

    async updateUser(req, res) {
        const { id } = req.params;
        const { email, role, password } = req.body;
        try {
            if (password && password.length < 8) {
                return res.status(400).json({ message: "A senha deve ter pelo menos 8 dígitos." });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const updatedUser = await userService.updateUser(id, {
                email,
                password: hashedPassword,
                role,
            });
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: "Error updating user", error });
        }
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            await userService.deleteUser(id);
            res.status(204).json({ message: "User deleted" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting user", error });
        }
    }
}

module.exports = new UserController();
