/**
 * Route: /passwordchange
 * Description: This route handles the password change functionality for authenticated users.
 * It verifies the user's current password, hashes the new password, and updates it in the database.
 * 
 * Security:
 * - Ensures the current password is validated before allowing a change.
 * - Uses bcrypt to securely hash the new password.
 * 
 * Usage:
 * - Endpoint: POST /passwordchange
 * - Request body: { currentPassword: string, newPassword: string }
 * 
 * Dependencies:
 * - bcryptjs: For hashing and comparing passwords.
 * - User model: Used to interact with the user data in the database.
 * 
 * Author: [Seemo]
 * Date: [9/21/2024]
 */


const express = require('express');
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing and comparing passwords
const User = require('../models/User'); // Assuming User is your user model

const router = express.Router();

// Define a route for password change
router.post('/passwordchange', async (req, res) => {
    try {
        // Extract current and new passwords from the request body
        const { currentPassword, newPassword } = req.body;

        // Find the user by their ID; make sure req.user.id is populated (e.g., from middleware)
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the current password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        // Hash the new password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password with the new hashed password
        user.password = hashedPassword;

        // Save the updated user object
        await user.save();

        // Return a success message
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        // Log error to the console for debugging
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
