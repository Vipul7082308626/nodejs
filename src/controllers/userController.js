import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
// const SECRET_KEY = "TAPE"
import Jwt from "jsonwebtoken";
import { validateEmail, validatePassword, validateFullName } from "../validate/validation.js"
import envconfig from "../config/envConfig.js";
// user register
import transporter from "../middleWare/emailConfig.js";
const userRegister = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Full name, email, and password are required" });
        }

        if (!validateFullName(fullName)) {
            return res.status(400).json({ message: "Invalid full name" });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: "This email is already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newDoc = new User({
            fullName,
            email,
            password: hashPassword,
        });
        const saveUser = await newDoc.save();
        if (saveUser) {
            return res.status(200).json({ message: "User registered successfully" });
        } else {
            return res.status(400).json({ message: "User not registered" });
        }
    } catch (error) {
        console.error("Error in user registration:", error);
        return res.status(500).json({ message: 'Error in user registration' });
    }
};


// login api 
const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ message: "user not found" });
        }
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "invalid credentials" });
        }
        const token = Jwt.sign({ id: existingUser._id, email: existingUser.email }, envconfig.SECRET_KEY)

        const userData = token;
        return res.status(200).json({ message: "login succesfully", userData });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};



// get all users api
const getAllUser = async (req, res) => {
    try {
        const getUsers = await User.find({});
        if (!getUsers) {
            return res.status(404).json({ message: 'User not found' })
        } else {
            return res.status(200).json({ message: 'Users found', getUsers })
        }
    } catch (error) {
        console.error('Erro in get users', error);
        return res.status(500).json({ message: 'Erro in get users', error })
    }
}



// update user by id


// let updateUserById = async (req, res, next) => {
//     try {
//         let userId = req.params.id;

//         let updatedEmail = req.body.email;

//         let updateUser = await User.findByIdAndUpdate(userId, { email: updatedEmail }, { new: true });

//         if (!updateUser) {
//             return res.status(404).json({ message: "user not update" });
//         }
//         else {
//             return res.status(200).json({ message: "user update", updateUser });
//         }
//     }
//     catch (error) {
//         console.error("error", error);
//         return next(error);
//     }
// }

// update user by id

let updateUserById = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'token is missing' });
        }
        const decode = Jwt.verify(token, envconfig.SECRET_KEY);
        // let updateUser  = await User.findById(decode.id);
        let updatedEmail = req.body.email;

        let updateUser = await User.findByIdAndUpdate(decode.id, { email: updatedEmail }, { new: true });

        if (!updateUser) {
            return res.status(404).json({ message: "user not update" });
        }
        else {
            return res.status(200).json({ message: "user update", updateUser });
        }
    }
    catch (error) {
        console.error("error", error);
        return next(error);
    }
}

// get user by id only

// let getUserId = async (req, res, next) => {
//     try {
//         let getUser = await User.findById(req.params.id);
//         if (!getUser) {
//             return res.status(404).json({ message: "user not found" });
//         }
//         else {
//             return res.status(200).json({ message: "user found", getUser });
//         }
//     }
//     catch (error) {
//         console.error("error", error);
//         return next(error);
//     }

// }

// get user 

let getUserId = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'token is missing' });
        }
        const decode = Jwt.verify(token, envconfig.SECRET_KEY);
        let getUser = await User.findById(decode.id);
        
        if (!getUser) {
            return res.status(404).json({ message: "user not found" });
        }
        else {
            return res.status(200).json({ message: "user found", getUser });
        }
    }
    catch (error) {
        console.error("error", error);
        return next(error);
    }

}

// delete user by id


// const deleteUser = async (req, res) => {
//     try {

//         let delUser = await User.findByIdAndDelete(req.params.id);

//         if (!delUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         else {

//             return res.status(200).json(delUser);
//         }
//     } catch (err) {
//         console.error("error", err)
//         return res.status(500).json({ message: 'error in delete user', err });
//     }
// };

// delete user 

const deleteUser = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'token is missing' });
        }
        const decode = Jwt.verify(token, envconfig.SECRET_KEY);
        const delteUser = await User.findByIdAndDelete(decode.id);
        if (!decode) {
            return res.status(404).json({ message: 'id is missing in payload' });
        }
        if (!delteUser) {
            return res.status(500).json({ message: 'user not deleted' })
        } else {
            return res.status(201).json({ message: 'user deleted succesfully', delteUser });
        }
    } catch (error) {
        console.error("Error in updating user")
        return res.status(500).json({ message: 'error in deleting user' });
    }
}

// send mail

const sendEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (email) {
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(404).json({ message: "Email not found" });
            } else {
                const genToken = Jwt.sign({ _id: user._id }, envconfig.SECRET_KEY, { expiresIn: '1h' });
                const link = `http://localhost:3000/reset-password/?token=${genToken}`;

                const sendMail = await transporter.sendMail({
                    from: envconfig.EMAIL_USER,
                    to: email,
                    subject: 'Reset Password',
                    html: `Click here to reset your password <a href= ${link}>click here</a> `
                })
                return res.status(200).json({ message: "Email is sent, please check your email" });
            }
        }

    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({ message: "Error in sending email", error });
    }
}

// reset password

const resetPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    try {
        const token = req.query.token;
        const decode = Jwt.verify(token, envconfig.SECRET_KEY);
        const user = await User.findById(decode._id);
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required." },
            );
        }
        if (!confirmPassword) {
            return res.status(400).json({
                message: "Confirm password is required."
            },
            );
        }
        if (newPassword !== confirmPassword) {
            return res
                .status(500)
                .json({ message: "New password and confirm password not match." });
        } else {
            const salt = await bcrypt.genSalt(10);
            const newHashpassword = await bcrypt.hash(newPassword, salt);
            // await User.findOneAndUpdate(user._id, { $set: {password: newHashpassword} });
            user.password = newHashpassword;
            await user.save();
            return res.status(200).json({ message: "Password Reset Successfully" });
        }
    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({ message: "Error in reset password", error });
    }
}

//   change password

const changePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    try {
        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide email, old password, and new password." });
        }
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!oldPassword || !existingUser.password) {
            return res.status(400).json({ message: "Invalid request. Please provide both old and new passwords." });
        }

        const matchPassword = await bcrypt.compare(oldPassword, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid current password." });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({ message: "New password must be different from the old password." });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        existingUser.password = hashedNewPassword;
        await existingUser.save();

        return res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({ message: "Error in change password", error });
    }
};


export { userRegister, sendEmail, Login, getAllUser, getUserId, deleteUser, updateUserById, resetPassword, changePassword };
