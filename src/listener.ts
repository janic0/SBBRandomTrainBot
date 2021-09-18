import continueJourney from "./interactions/continueJourney"
import journeys from "./journeys"
import sendMessage from "./telegram/sendMessage"
const minutesCovered: number[] = new Array()

setInterval(() => {
	const now = new Date()
	if (!minutesCovered.includes(now.getFullYear() * 100000000 +
		now.getMonth() * 1000000 +
		now.getDate() * 10000 +
		now.getHours() * 100 +
		now.getMinutes())) {
		minutesCovered.push(
			now.getFullYear() * 100000000 +
			now.getMonth() * 1000000 +
			now.getDate() * 10000 +
			now.getHours() * 100 +
			now.getMinutes())
		journeys.forEach((h) => {
			if (h.active) {
				if (h.currentArrivalDate.getHours() * 100 + h.currentArrivalDate.getMinutes() === now.getHours() * 100 + now.getMinutes()) {
					sendMessage("Get off the train", h.notifierChats)
					if (h.autoPlay) {
						continueJourney(h)
					}

				}
			}
		})
	}
}, 1000)