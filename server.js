const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const app = express();
app.use(express.json());

let users = []; // This should be replaced with a real database
let resetTokens = [];

app.post('/request-password-reset', (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).send('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    resetTokens.push({ token, email, expires: Date.now() + 3600000 }); // 1 hour expiration

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `You requested a password reset. Click the link to reset your password: http://localhost:3000/reset-password/${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email');
        }
        res.send('Password reset email sent');
    });
});

app.post('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const resetToken = resetTokens.find(t => t.token === token && t.expires > Date.now());
    if (!resetToken) {
        return res.status(400).send('Invalid or expired token');
    }

    const user = users.find(u => u.email === resetToken.email);
    user.password = bcrypt.hashSync(password, 10);
    resetTokens = resetTokens.filter(t => t.token !== token);

    res.send('Password has been reset');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
