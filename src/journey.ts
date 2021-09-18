class Journey {
	id: number;
	notifierChats: number[] = []
	active = true;
	autoPlay = true;
	startStation: string;
	coveredStations: string[] = []
	station: {name: string, id: string, coordinate: {type: string, x: number, y: number}} = {name: "", id: "", coordinate: {type: "", x: 0, y: 0}};
	increaseX: boolean = false;
	lastX: number = 0;
	currentArrivalDate: Date;
	constructor(id: number, arrival: Date, station: any, x: number) {
		this.id = id;
		this.notifierChats = [id]
		this.currentArrivalDate = arrival;
		this.station = station;
		this.startStation = station
		if (47 > x ) {
			this.increaseX = true
		}
		this.lastX = x;
	}
}
export default Journey;