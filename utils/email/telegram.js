import axios from "axios"

const sendTelegramMessage = async (message) => {
  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID, 
        text: message,
      }
    );
  } catch (error) {
    console.log("Telegram error:", error.message);
  }
};

export default sendTelegramMessage;