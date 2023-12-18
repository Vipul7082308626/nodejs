import Jwt from "jsonwebtoken";
import envconfig from "../config/envConfig.js";


const verifyToken = async (req, res, next) => {
    try {
        const token = req.header.authorization.split(" ")[1];
        console.log(token);
        const verify = Jwt.verify(token, envconfig.SECRET_KEY);
        if (verify.userType == "user") {
            next();
        } else {
            return res.status(404).json({ message: "not user" });
        }
    } catch (error) {
        console.error("Error in verify Token", error);
        return res.status(404).json({ message: "invalid Token", error });
    }
};
export { verifyToken };
// import jwt from "jsonwebtoken";

// const verifyToken = async (req, res, next) => {
//     try {
//         const authorizationHeader = req.headers.authorization;

//         if (!authorizationHeader) {
//             return res.status(401).json({ message: "Authorization header missing" });
//         }

//         const token = authorizationHeader.split(" ")[1];

//         if (!token) {
//             return res.status(401).json({ message: "Token not provided" });
//         }

//         console.log(token);

//         const verify = jwt.verify(token, "TAPE");

//         if (verify.userType == "user") {
//             next();
//         } else {
//             return res.status(401).json({ message: "Not an user" });
//         }
//     } catch (error) {
//         console.error("Error in verify Token", error);
//         return res.status(401).json({ message: "Invalid Token", error });
//     }
// };

// export { verifyToken };
