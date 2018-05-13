exports.getInfoIP = (callback) => {
	fetch('http://ip-api.com/json').then((response) => response.json()).then((result) => {
		let x = {
			city : result.city,
			country : result.country
		}
		return callback(x)
	})
}