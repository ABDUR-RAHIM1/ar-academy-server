
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { adminSecretKey, secretKey } from "../../config/constans.js";
import AccountModel from "../../models/accounts/account.model.js";
import { serverError } from "../../helpers/serverError.js";

//  register 
export const registerAccount = async (req, res) => {

    const { plan, username, email, password, profilePhoto, role, adminKey } = req.body;

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
            profilePhoto,
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
}

//  Update User  Status
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


// delete User Account only for admin
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