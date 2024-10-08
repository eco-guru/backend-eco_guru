import { prismaClient } from "../application/database.js";
import bcrypt from 'bcrypt';

export const adminMiddleware = async (req, res, next) => {
    const token = req.get('Authorization');
    
    if (!token) {
        return res.status(401).json({
            errors: "Unauthorized - Token is missing"
        }).end();
    }

    // Cari user berdasarkan token
    const user = await prismaClient.users.findFirst({
        where: {
            token: token
        },
        include: {
            Roles: true // Ambil role user juga
        }
    });

    if (!user) {
        return res.status(401).json({
            errors: "Unauthorized - Invalid token"
        }).end();
    }

    // Ambil cookie 'user-role'
    const encryptedRole = req.cookies['user-role'];

    if (!encryptedRole) {
        return res.status(403).json({
            errors: "Forbidden - Role cookie is missing"
        }).end();
    }

    // Bandingkan role user yang terenkripsi dengan role Admin
    const isAdmin = await bcrypt.compare('Admin', encryptedRole);

    if (!isAdmin) {
        return res.status(403).json({
            errors: "Forbidden - You do not have admin access"
        }).end();
    }

    // Jika role Admin, izinkan melanjutkan
    req.user = user;
    next();
};
