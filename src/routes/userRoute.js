import express from 'express';
import { userRegister, getAllUser,Login,sendEmail, getUserId, deleteUser , updateUserById,resetPassword,changePassword} from '../controllers/userController.js';
import { verifyToken } from '../middleWare/verifyToken.js';
const router = express();


// register route
router.post('/register', userRegister);

// // get loginUsers
router.post('/Login', Login);

// get all users
router.get('/getAllUsers',getAllUser, verifyToken);


//  update user by id 
router.put('/updateUserById', updateUserById);

//  get user by id 
router.get('/getUserId', getUserId);

//  delete user
router.delete('/deleteUser', deleteUser);

// send email
router.post('/sendemail',sendEmail)

// reset-password
router.post('/resetPassword',resetPassword)

// change password
router.post('/changePassword',changePassword)

export default router;