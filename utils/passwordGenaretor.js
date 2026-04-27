//  accoutMethod === phone/email type 
// method === "email" or "phone"
export const passwordGenaretor = (accountMethod, phone, email) => {

    let password = "";

    if (accountMethod === "phone") {
        password = phone.slice(-8)
    };

    if (accountMethod === "email") {
        const emailFrontPart = email.split("@")[0];
        password = emailFrontPart + "1122"
    }

    return password; 
}