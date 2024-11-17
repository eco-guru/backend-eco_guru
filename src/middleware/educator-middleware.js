import { prismaClient } from "../application/database.js";
import bcrypt from 'bcrypt';

export const educatorMiddleware = async (req, res, next) => {
    const token = req.get('Authorization');

    if (!token) {
        return res.status(401).json({
            errors: "Unauthorized - Token is missing",
        }).end();
    }

    // Cari user berdasarkan token
    const user = await prismaClient.users.findFirst({
        where: {
            token: token,
        },
        include: {
            Roles: true, // Ambil role user juga
        },
    });

    if (!user) {
        return res.status(401).json({
            errors: "Unauthorized - Invalid token",
        }).end();
    }

    const encryptedRole = req.cookies['user-role'];

    if (!encryptedRole) {
        return res.status(403).json({
            errors: "Forbidden - Role cookie is missing",
        }).end();
    }

    // Bandingkan role user yang terenkripsi dengan role Educator
    const isEducator = await bcrypt.compare('Educator', encryptedRole);

    if (!isEducator) {
        return res.status(403).json({
            errors: "Forbidden - You do not have Educator access",
        }).end();
    }

    req.user = user;
    next();
};
