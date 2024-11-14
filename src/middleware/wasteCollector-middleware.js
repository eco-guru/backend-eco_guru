import { prismaClient } from "../application/database.js";
import bcrypt from 'bcrypt';

export const wasteCollectorMiddleware = async (req, res, next) => {
    const token = req.get('Authorization');

    if (!token) {
        return res.status(401).json({
            errors: "Unauthorized - Token is missing",
        }).end();
    }
    
    const user = await prismaClient.users.findFirst({
        where: {
            token: token,
        },
        include: {
            Roles: true,
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

    const isWasteCollector = await bcrypt.compare('Waste Collector', encryptedRole);

    if (!isWasteCollector) {
        return res.status(403).json({
            errors: "Forbidden - You do not have Waste Collector access",
        }).end();
    }

    req.user = user;
    next();
};
