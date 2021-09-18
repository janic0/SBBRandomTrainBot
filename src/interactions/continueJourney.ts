import Journey from "../journey";
import sendMessage from "../telegram/sendMessage";
import getTripAndDoLogic from "./getTripAndDoLogic";

const continueJourney = (j: Journey) => {
	getTripAndDoLogic(j.station.id, 3, j).then((e) => {
		if (e.arrival && e.station && e.station.id && e.passList) {
				if (j.active) {
					if (e) {
				sendMessage(e.message, j.notifierChats)
					j.station = e.station;
					j.lastX = e.station.coordinate.x
					j.currentArrivalDate = e.arrival as Date;
					let reached = false;
					j.coveredStations.push(e.station.id)
					e.passList.forEach((k: any, idx) => {
						if (idx > 0) {
						if (!reached) {
							if (k.station && k.station.id && e.station && e.station.id) {
								if (k.station.id === e.station.id) {
									reached = true;
								} else {
									j.coveredStations.push(k.station.id)
								}
							}
						}
						}
						});
					}
				}
		}
	}).catch((err) => {
		sendMessage("journey can not continue", j.notifierChats)
		console.log("warning: internal error detected", err)
	})
}

export default continueJourney