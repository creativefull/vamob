import React, { Component } from 'react';
import {  View, Text, Alert} from 'react-native';
import Config from '../config/app.json'
import { StackNavigator } from "react-navigation";
import { RkButton, RkText, RkCard } from 'react-native-ui-kitten';
import Firebase from 'react-native-firebase';
const Banner = Firebase.admob.Banner;
const AdRequest = Firebase.admob.AdRequest;
const request = new AdRequest();

export default class HomeApp extends Component {
	static navigationOptions = ({navigation}) => ({
		title : 'Halaman Ke Dua'
	})

	constructor(props) {
	  super(props)
	
	  this.state = {
		 admobs : [
			"ca-app-pub-2762144360961656/2671071312",
			"ca-app-pub-2762144360961656/2671071312",
			"ca-app-pub-2762144360961656/2671071312",
			"ca-app-pub-2762144360961656/2671071312",
			"ca-app-pub-2762144360961656/2671071312",
			"ca-app-pub-2762144360961656/2671071312",
			"ca-app-pub-2762144360961656/2671071312",
			"ca-app-pub-2762144360961656/2671071312",
			"ca-app-pub-2762144360961656/2671071312",
			"ca-app-pub-2762144360961656/2671071312"
		]
	  };
	};

	componentDidMount() {
		setTimeout(() => {
			this.props.navigation.goBack()
		}, 50000)
	}

	renderAds() {
		if (this.state.admobs.length > 0) {
			return (
				<View>
					{
						this.state.admobs.map((admob, k) => {
							return (
								<View key={k}>
									<Banner
										unitId={admob}
										request={request.build()}
										onAdLoaded={() => {
											console.log("Ads Loaded")
										}}/>
								</View>
							)
						})
					}
				</View>
			)
		}
	}

	render() {
		return (
			<RkCard style={{padding: 10}}>
				<RkText>Admob</RkText>

				{this.renderAds()}
			</RkCard>
		);
	}
}
