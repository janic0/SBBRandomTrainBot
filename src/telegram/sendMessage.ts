import axios from "axios"

const sendMessage = (text: string, chat: string | number | number[]): void => {
	if (Array.isArray(chat)) {
		chat.forEach((g) => {
			axios.post("https://api.telegram.org/bot" + process.env.TOKEN + "/sendMessage", { chat_id: g, text }).catch((e) => {
				console.log(e)
			})
		})
	} else {

		axios.post("https://api.telegram.org/bot"  + process.env.TOKEN + "/sendMessage", { chat_id: chat, text }).catch((e) => {
			console.log(e)
		})
	}
}

export default sendMessage;