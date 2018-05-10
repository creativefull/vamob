import firebase from 'react-native-firebase'
const db = firebase.database()

exports.getAds = (callback) => {
	db.ref('admobs').on('value', (value) => {
		let results = value.val()
		callback(results)
	})
}