import axios from "axios"
import Journey from "../journey"
import filterStations from "../utils/filterStations"

const getTripAndDoLogic = (station: string, chat: number, journey?: Journey): Promise<{ message: string, ok: boolean, arrival: Date | undefined, station: {name: string, id: string, coordinate: {type: string, x: number, y: number}} | undefined, passList?: any[]}> => {
	const now = new Date()
	now.setTime(now.getTime() + 180000 + 7200000)
	return axios.get("http://transport.opendata.ch/v1/stationboard", {
		params: {
			limit: 10,
			id: station,
			datetime: now.toISOString(),
			transportations: ["train"]
		}
	}).then((f) => {
		if (f.data.stationboard.length) {
			if (Array.isArray(f.data.stationboard)) {
				let connection: any = {}
				if (journey) {
					const validConnections = filterStations(f.data.stationboard, journey)
					if (validConnections.length) {
						// connection = validConnections[0]
						connection = validConnections[Math.floor(Math.random() * 0.3 * validConnections.length)]
					} else {
						connection = f.data.stationboard[Math.floor(Math.random() * f.data.stationboard.length)]
					}
				} else {
					connection = f.data.stationboard[Math.floor(Math.random() * 0.3 * f.data.stationboard.length)]
					connection.passList.length
				}
				let stop: any = {}
				if (connection.longestStation) {
					stop = connection.passList[connection.longestStation]
				}else {
				// stop = (connection.passList[Math.floor( connection.passList.length - Math.random() * 0.2 * connection.passList.length) ])
				// this would make it random
				stop = connection.passList[connection.passList.length - 1]

				}
				
				return {
					passList: connection.passList,
					station: stop.station,
					message: "from " + connection.stop.station.name + (connection.stop.platform ? " (platform " + connection.stop.platform + ")" : "") + " in " + (
						(Math.floor(((connection.stop.departureTimestamp) - (new Date().getTime() / 1000)) / 60))).toString() + " minutes ", ok: true, arrival: new Date(stop.arrivalTimestamp * 1000)
				}
			} else {
				return {
					ok: false,
					message: "unknown error",
					arrival: undefined,
					station: undefined
				}
			}
		} else {
			return { message: "found no connections", ok: false, arrival: undefined, station: undefined }
		}
	})
}

export default getTripAndDoLogic;