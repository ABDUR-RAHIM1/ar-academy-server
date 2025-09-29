
import { roles } from "../config/constans.js";
import AccountModel from "../models/accounts/account.model.js";

//  req.user pass Hoye asce => questionsCintroller theke
// user er moddhe user info / admin info thakte pare (role onujayi)
 
 

export const accessQuestion = async (user) => {
    try {
        if (!user) {
            return {
                status: 401,
                message: "এই প্রশ্নে পরীক্ষা দিতে হলে তোমাকে লগইন করতে হবে।"
            };
        }

        // ✅ Admin হলে direct access
        if (user.role === roles.admin) {
            return { status: 200, user }; 
        }

        // ✅ User হলে DB থেকে verify করতে হবে
        const foundUser = await AccountModel.findById(user.id);

        if (!foundUser) {
            return { status: 404, message: "ইউজার পাওয়া যায়নি" };
        }

        return { status: 200, user: foundUser };

    } catch (error) {
        return { status: 500, message: "Server Error", error };
    }
};


