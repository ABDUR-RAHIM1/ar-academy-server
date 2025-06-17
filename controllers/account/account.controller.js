
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { adminSecretKey, backendUrl, clientUrl, jwtEmailSecret, secretKey } from "../../config/constans.js";
import AccountModel from "../../models/accounts/account.model.js";
import { serverError } from "../../helpers/serverError.js";
import { sendEmail } from "../../utils/email/email.js";

//  register 
export const registerAccount = async (req, res) => {
    const { plan, username, email, password, role, adminKey } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All Fields required" });
    }

    try {
        // Admin secret key check
        if (role === "admin") {
            if (!adminKey || adminKey !== adminSecretKey) {
                return res.status(400).json({ message: "Invalid Admin Secret Key" });
            }
        }

        // Check if email exists
        const isExist = await AccountModel.findOne({ email });
        if (isExist) {
            return res.status(400).json({ message: "Email Already Exist" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new user (unverified)
        const newUser = new AccountModel({
            plan,
            username,
            email,
            password: hashPassword,
            role,
            isVerified: false,
        });

        const account = await newUser.save();

        // Generate email verification token (valid 15 minutes)
        const emailToken = jwt.sign(
            { userId: account._id },
            jwtEmailSecret,
            { expiresIn: '15m' }
        );

        const verificationLink = `${backendUrl}/api/account/verify-email?token=${emailToken}`;

        const options = {
            to: email,
            subject: `Welcome ${username}! Please Verify Your Email`,
            html: `
            <h2>Hi ${username},</h2>
            <p>Thanks for registering! Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}">Click Me to Verify Email</a>
            <p>This link will expire in 15 minutes.</p>
          `,
        };

        try {
            await sendEmail(options)
        } catch (err) {
            console.error("Email sending failed:", err.message);
        }

        res.json({ message: "Register successful! Please check your email to verify your account." });

    } catch (error) {
        console.error(error);
        serverError(res, error);
    }
};


//  email verify 
export const emailVerify = async (req, res) => {
    const { token } = req.query;

    try {
        // Verify the token
        const decoded = jwt.verify(token, jwtEmailSecret);

        // Update the user's verification status
        const updatedUser = await AccountModel.findByIdAndUpdate(
            decoded.userId,
            { isVerified: true },
            { new: true }
        );

        // ✅ Generate login token
        const loginToken = jwt.sign(
            {
                id: updatedUser._id.toString(),
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role
            },
            secretKey,
            { expiresIn: '7d' }
        );

        // ✅ Redirect to frontend success page with token
        return res.redirect(`${clientUrl}/account/verify/success?token=${loginToken}`);
    } catch (error) {
        console.log(error
        )
        // Token expired or invalid
        return res.redirect(`${clientUrl}/account/verify/failed`);
    }
};


// ✅ Resend Verification Email Controller
export const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await AccountModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Account is already verified" });
        }

        // নতুন verification token
        const emailToken = jwt.sign(
            { userId: user._id },
            jwtEmailSecret,
            { expiresIn: '15m' }
        );

        const verificationLink = `${backendUrl}/api/account/verify-email?token=${emailToken}`;

        const now = new Date().toLocaleString("en-US", {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZone: 'Asia/Dhaka'
        });

        const emailOptions = {
            to: email,
            subject: `Resend Email Verification - ${now}`, // ✅ Subject includes time
            html: `
              <h2>Hi ${user.username},</h2>
              <p>Please verify your email by clicking the link below:</p>
              <a href="${verificationLink}">Click here to verify your email</a>
              <p>This link will expire in 15 minutes.</p>
              <hr/>
              <p style="font-size: 12px; opacity: 0.6;">Token ID: ${emailToken.slice(-6)} | Time: ${now}</p>
            `,
        };

        try {
            await sendEmail(emailOptions);
        } catch (err) {
            console.error("Email sending failed:", err.message);
            return res.status(500).json({ message: "Email sending failed" });
        }

        return res.status(200).json({ message: "Verification email sent, please check your inbox." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};






// login
export const loginAccount = async (req, res) => {
    const { email, password, role } = req.body;

    // All Fields Validation
    if (!email || !password || !role) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        // Email & Role Match Check
        const isAccount = await AccountModel.findOne({ email, role });

        // Check if account exists
        if (!isAccount) {
            return res.status(404).json({
                message: "Invalid credentials (email or role mismatch)"
            });
        }

        // Check if account is verified
        if (!isAccount.isVerified) {
            return res.status(403).json({
                message: "Please verify your email address before logging in.",
                code: "EMAIL_NOT_VERIFIED"
            });
        }

        // Check if account status is not 'active'
        if (isAccount.status !== "active") {
            return res.status(400).json({
                message: `Your account has been ${isAccount.status}. Please contact the admin.`
            });
        }

        // Compare Password
        const matchPassword = await bcrypt.compare(password, isAccount.password);
        if (!matchPassword) {
            return res.status(404).json({
                message: "Invalid credentials (wrong password)"
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



//  get all for user for admin 
export const getAllUserForAdmin = async (req, res) => {
    try {

        const accounts = await AccountModel.find({ role: "user" })
            .select("-password")
            .sort({ createdAt: -1 });

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
            .sort({ createdAt: -1 });

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



// delete User Account only for admin 
export const deleteUserAccount = async (req, res) => {
    const { accountId } = req.params;

    try {
        if (!accountId) {
            return res.status(400).json({
                message: "Account ID not found"
            });
        }

        // চেক করি এই account টা আছে কিনা
        const accountToDelete = await AccountModel.findById(accountId);

        if (!accountToDelete) {
            return res.status(404).json({
                message: "অ্যাকাউন্ট পাওয়া যায়নি"
            });
        }

        // যদি এই account টি admin হয়
        if (accountToDelete.role === "admin") {

            // 🔒 যদি ইমেইল SUPER_ADMIN_EMAIL হয়
            if (accountToDelete.email === "onushilona@gmail.com") {
                return res.status(403).json({
                    message: "এই অ্যাডমিন অ্যাকাউন্টটি ডিলিট করা যাবে না।"
                });
            }

            // 🔒 যদি এটা শেষ admin হয়
            const totalAdmins = await AccountModel.countDocuments({ role: "admin" });
            if (totalAdmins <= 1) {
                return res.status(403).json({
                    message: "কমপক্ষে একজন অ্যাডমিন থাকা বাধ্যতামূলক।"
                });
            }
        }

        // ✅ তারপর ডিলিট করবো
        await AccountModel.findByIdAndDelete(accountId);

        return res.status(200).json({
            message: "অ্যাকাউন্ট সফলভাবে ডিলিট হয়েছে।"
        });

    } catch (error) {
        serverError(res, error);
    }
};
