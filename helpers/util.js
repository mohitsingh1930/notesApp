
module.exports = {

	stringToDate: function (string) {

		let date = string.split(" ")[0].split("-");							//format= DD-MM-YYYY HH:MM:SS
		let time = string.split(" ")[1].split(":");

		return new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2])

	},

	dateToString: function (date) {

		return date.toLocaleDateString("en-US", {year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", seconds: "numeric", hour12: false})

	}

}

