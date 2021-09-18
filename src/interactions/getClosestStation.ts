import axios from "axios";

const getClosestStation = (x: number, y: number): Promise<{name: string, id: string, coordinate: {type: string, x: number, y: number}}> => {
	return axios.get("http://transport.opendata.ch/v1/locations", {
		params: {
			x,
			y,
			type:
				"station"

		}
	}).then((r) => {
		let shortestDistance = 9999999999
		let station = {
			id: '1111111',
			name: "",
			coordinate: {
				type: "",
				x: 0,
				y: 0
			}
		};
		r.data.stations.forEach((s: any) => {
			if (s.icon === "train" || s.icon === null) {
				if (typeof s.distance == "number") {
					if (s.distance < shortestDistance && s.id) {
						station = s
						shortestDistance = s.distance;
					}
				}
			}
		})
		return station;
	})
}

export default getClosestStation;