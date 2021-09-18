import sendMessage from "./telegram/sendMessage";
import Journey from "./journey";
import fastify from "fastify";
import journeys from "./journeys";
import getTripAndDoLogic from "./interactions/getTripAndDoLogic";
import continueJourney from "./interactions/continueJourney";
import getClosestStation from "./interactions/getClosestStation";
import "./listener";


const app = fastify()

app.post("/" + process.env.URL, (req, res) => {
	if (typeof req.body === "object") {
		const body = req.body as any
		if (typeof body.message === "object") {
			if (typeof body.message.text === "string") {
				if (body.message.text === "/autoplay") {
					journeys.forEach((j) => {
						if (j.active && j.id === body.message.chat.id) {
							sendMessage("autoplay turned " + (
								!j.autoPlay ? "on" : "off"
							),
								j.notifierChats)
							j.autoPlay = !j.autoPlay
						}
					})
				} else if (
					body.message.text === "/continue"
				) {
					journeys.forEach((j) => {
						if (j.active && j.id === body.message.chat.id) {
							sendMessage("continuing journey", j.notifierChats)
							continueJourney(j);
						}
					})
				} else if (
					body.message.text === "/cancel"
				) {
					journeys.forEach((j) => {
						if (j.active && j.id === body.message.chat.id) {
							j.active = false;
							sendMessage("journey cancelled", j.notifierChats)
						}
					})
				} else if (
					body.message.text.includes("/join ")
				) {
					const join = body.message.text.split(" ")[1]
					journeys.forEach((j) => {
						if (j.active) {
							if (j.id.toString() === join) {
								if (!j.notifierChats.includes(body.message.chat.id)) {
									j.notifierChats.push(body.message.chat.id)
					sendMessage(body.message.chat.first_name + " joined the journey", j.notifierChats)
								} else {
									sendMessage("already subscribed", body.message.chat.id)
								}
							}
						}
					})
				}
			}
			if (typeof body.message.location === "object") {
				if (typeof body.message.location.latitude === "number") {
					if (typeof body.message.location.longitude === "number") {
						let hasJourney = false;
						journeys.forEach((j) => {
							if (j.id === body.message.chat.id && j.active) {
								hasJourney = true;
							}
						})
						if (hasJourney) {
							sendMessage("please cancel ongoing journey first", body.message.chat.id)
						} else {
							getClosestStation(body.message.location.latitude, body.message.location.longitude).then((station) => {
								getTripAndDoLogic(station.id, body.message.chat.id).then((h) => {
									sendMessage(h.message, body.message.chat.id)
									if (h.arrival && h.station && h.passList) {
										const j = new Journey(
												body.message.chat.id,
												h.arrival,
												h.station, station.coordinate.x)
												j.coveredStations.push(station.id)
										let reached = false;
										h.passList.forEach((e, idx) => {
											if (idx > 0) {
											if (!reached) {
												if (e.station && e.station.id && h.station && h.station.id) {
													if (e.station.id === h.station.id) {
														reached = true;
													} 
														j.coveredStations.push(e.station.id)
												}
											}
											}
										});
										journeys.push(
											j
										)
										sendMessage("your id is " + body.message.chat.id, body.message.chat.id)

									}
								}).catch((err) => {
									console.log(err)
									sendMessage("no station found", body.message.chat.id)
								})
							})
						}
					}
				}
			}
			res.send("thanks durov")
		}
	}
})

app.listen((process.env.PORT || 5000), "0.0.0.0", () => { console.log("server is up") })
