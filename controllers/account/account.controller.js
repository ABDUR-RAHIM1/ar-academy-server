
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { adminSecretKey, secretKey } from "../../config/constans.js";
import AccountModel from "../../models/accounts/account.model.js";
import { serverError } from "../../helpers/serverError.js";

//  register 
export const registerAccount = async (req, res) => {

    const { plan, username, email, password, role, adminKey } = req.body;

    //  All Fields Validation
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All Fields required"
        })
    }



    try {

        // যদি ইউজার `admin` হয়, তাহলে secret key যাচাই করতে হবে
        if (role === "admin") {
            if (!adminKey || adminKey !== adminSecretKey) {
                return res.status(400).json({
                    message: "Invalid Admin Secret Key"
                })  // Unauthorized Request
            }
        }

        //  Email Exist Check
        const isExist = await AccountModel.findOne({ email });
        if (isExist) {
            return res.status(400).json({
                message: "Email Already Exist"
            })
        }

        //  New User Create
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new AccountModel({
            plan,
            username,
            email,
            password: hashPassword,
            role
        });

        const account = await newUser.save();

        //  Token Generate
        const accountToken = {
            id: account._id.toString(),
            username: account.username,
            email: account.email,
            role: account.role,
        };

        const token = jwt.sign(accountToken, secretKey, { algorithm: 'HS256' })

        res.json({ message: "Register successful!", token });

    } catch (error) {
        console.log(error)
        serverError(res, error)
    }
};


// login
export const loginAccount = async (req, res) => {
    const { email, password } = req.body;

    // All Fields Validation
    if (!email || !password) {
        return res.status(400).json({
            message: "All Fields required"
        });
    }

    try {
        // Email Exist Check
        const isAccount = await AccountModel.findOne({ email });
        if (!isAccount) {
            return res.status(404).json({
                message: "Invalid Credentials"
            });
        }

        // Compare Password
        const matchPassword = await bcrypt.compare(password, isAccount.password);
        if (!matchPassword) {
            return res.status(404).json({
                message: "Invalid Credentials"
            });
        }

        // Token Generation
        const accountToken = {
            id: isAccount._id.toString(),
            username: isAccount.username,
            email: isAccount.email,
            role: isAccount.role
        };

        const token = jwt.sign(accountToken, secretKey, { algorithm: 'HS256', expiresIn: '7d' });


        return res.status(200).json({
            message: "Login successfully!",
            token: token
        });

    } catch (error) {
        return serverError(res, error);
    }
};

//  get all for admin 
export const getAllUserForAdmin = async (req, res) => {
    try {

        const accounts = await AccountModel.find().select("-password");
        return res.status(200).json(accounts)

    } catch (error) {
        serverError(res, error)
    }
}


//  get all admin for admin (role : admin)
export const getAllAdmin = async (req, res) => {
    try {

        const admins = await AccountModel.find({ role: "admin" })
            .select("-password")

        return res.status(200).json(admins)

    } catch (error) {
        serverError(res, error)
    }
}




//  get login user account using token
export const getSingleUser = async (req, res) => {
    try {
        const { id } = req.user;

        const accounts = await AccountModel.findById(id)
            .select("-password")
            .populate("plan")
        return res.status(200).json(accounts)

    } catch (error) {
        console.log(error)
        serverError(res, error)
    }
};


//  get login Admin account using token
export const getSinglAdmin = async (req, res) => {
    try {
        const { id } = req.admin;

        const adminAccount = await AccountModel.findById(id)
            .select("-password")
            .populate("plan")
        return res.status(200).json(adminAccount)

    } catch (error) {
        console.log(error)
        serverError(res, error)
    }
}


//  Update User  Status (admin authenticatiob guard add korte hbe)
export const updateUserAccount = async (req, res) => {
    const { userId } = req.params;
    const { status } = await req.body;


    try {

        if (!status) {
            return res.status(400).json({
                message: "Status Required"
            })
        }

        const isUpdated = await AccountModel.findByIdAndUpdate(userId, {
            $set: {
                status: status
            }
        }, { new: true });

        if (!isUpdated) {
            return res.status(404).json({
                message: "User not found"
            })
        };

        return res.status(200).json({
            message: "Status Updated",
            data: isUpdated
        })


    } catch (error) {
        serverError(res, error)
    }
};


// Update user account information for user
export const updateMyAccount = async (req, res) => {
    try {

        const { userId } = req.params;

        const { username, email, password, profilePhoto, mobile, dob, gender, address, qualification, instituteName, favoriteSubject } = req.body;

        const isUpdated = await AccountModel.findByIdAndUpdate(userId, {
            $set: {
                username,
                email,
                password,
                profilePhoto,
                mobile,
                dob,
                gender,
                address,
                qualification,
                instituteName,
                favoriteSubject
            }
        });


        if (!isUpdated) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "Your account updated successfully"
        })


    } catch (error) {
        console.log(error)
        return serverError(res, error)
    }
}


// Update Admin account information for Login
export const updateAdminAccount = async (req, res) => {
    try {

        const { adminId } = req.params;

        const { username, email, password, profilePhoto, mobile, dob, gender, address, qualification, instituteName, favoriteSubject } = req.body;

        const isUpdated = await AccountModel.findByIdAndUpdate(adminId, {
            $set: {
                username,
                email,
                password,
                profilePhoto,
                mobile,
                dob,
                gender,
                address,
                qualification,
                instituteName,
                favoriteSubject
            }
        });


        if (!isUpdated) {
            return res.status(404).json({
                message: "Admin not found"
            })
        }

        return res.status(200).json({
            message: "Your account updated successfully"
        })


    } catch (error) {
        console.log(error)
        return serverError(res, error)
    }
}



// delete User Account only for admin (admin authenticatiob guard add korte hbe)
export const deleteUserAccount = async (req, res) => {
    const { userId } = req.params

    try {
        if (!userId) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        const isDeleted = await AccountModel.findByIdAndDelete(userId);

        if (isDeleted) {
            return res.status(200).json({
                message: "User Deleted Succesfully"
            })
        }

    } catch (error) {
        serverError(res, error)
    }
};