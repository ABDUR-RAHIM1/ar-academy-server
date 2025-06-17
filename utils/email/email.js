// utils>email.js

import nodemailer from 'nodemailer';
import { emailPass, emailUser } from '../../config/constans.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass,
    },
});

/**
 * Send Email
 * @param {String} to - Receiver Email
 * @param {String} subject - Email Subject
 * @param {String} html - Email Body (HTML format)
 */

export const sendEmail = async ({to, subject, html}) => {
    const mailOptions = {
        from: `"Onushilon Academy" <${emailUser}>`,
        to,
        subject,
        html,
    };

    return transporter.sendMail(mailOptions);
};
