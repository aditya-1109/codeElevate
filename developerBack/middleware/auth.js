
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const role = req.headers.role;
    if(!role || (role !== "admin" && role !== "student")){
        return res.status(401).json({message:"Unauthorized"})
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    try {
        let secret = process.env.JWT_SECRET;
        if(role === "admin"){
            secret = process.env.JWT_SECRET_ADMIN;
        }
        const decodedToken = jwt.verify(token, secret);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({message:"Unauthorized"})
    }
}