import Journey from "../journey"

const filterStations = (connection: any[], journey: Journey): any[] => {
	const placesRankings: any[] = [0, 0, 0]
	const placesConnections: any[] = []
		const validConnections: any = []
		connection.forEach((c) => {
			const validStations: any[] = []
			let maxDistance = 0
			let longestStation = 0
			c.passList.forEach((p: any, idx: number) => {
				if (idx > 0) {
					let stationValid = true;
					if (p.station.id) {
						if (journey.coveredStations.includes(p.station.id)) {
							stationValid = false;
						}
						if (journey.increaseX) {
							if (p.station.coordinate.x < journey.lastX) { 
								stationValid = false;
							}
						} else {
							if (p.station.coordinate.x > journey.lastX) {
								stationValid = false;
							}
						}
						if (stationValid) {
							validStations.push(p)
						}
							if (stationValid) {
								let currentDistance = 0
								if (journey.increaseX) {
									currentDistance = p.station.coordinate.x - journey.lastX
								} else {
									currentDistance = journey.lastX - p.station.coordinate.x
								}
								if (currentDistance > maxDistance) {
									maxDistance = currentDistance
									longestStation = idx
								}
						}
						if (stationValid) {
							validStations.push(p)
						}
					}}
			});
			// if (100 / c.passList.length * validStations.length >= 50) {
			// 		console.log("connection rating " + 100 / c.passList.length * validStations.length )
			if (validStations.length) {
				c.longestStation = longestStation
				c.passList = validStations
				validConnections.push(c)
			// }
			if (maxDistance > placesRankings[2]) {
				if (maxDistance > placesRankings[1]) {
					if (maxDistance > placesRankings[0]) {
						placesConnections[2] = placesConnections[1]
						placesRankings[2] = placesRankings[1]
						placesConnections[1] = placesConnections[0]
						placesRankings[1] = placesRankings[0]
						placesConnections[0] = c
						placesRankings[0] = maxDistance
					} else {
						placesConnections[2] = placesConnections[1]
						placesRankings[2] = placesRankings[1]
						placesConnections[1] = c
						placesRankings[1] = maxDistance
					}
				} else {
					placesRankings[2] = maxDistance
					placesConnections[2] = c
				}
			}
			}
		})
		if (!placesRankings[0]) {
			return []
		}
		else if (placesRankings[0] > 0 && placesRankings[1] === 0) {
			return placesConnections.splice(0)
		} else if (placesRankings[0] > 0 && placesRankings[1] > 0 && placesRankings[2] === 0) {
			return placesConnections.splice(0, 2)
		} else if (placesRankings[0] > 0 && placesRankings[1] > 0 && placesRankings[2] > 0) {
			return placesConnections
		} else {
			return placesConnections
		}
		return []
}
export default filterStations;