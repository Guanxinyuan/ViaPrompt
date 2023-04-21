// pages/api/generateToken.js
import jwt from 'jsonwebtoken';

export default async (req, res) => {
    const payload = {
        role: 'webhook-handler',
        // add any custom claims here
    };

    const secret = process.env.SUPABASE_JWT_SECRET; // your Supabase JWT secret
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    res.status(200).json({ success: true, data: token });
};
