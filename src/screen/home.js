import React, { Component } from 'react';
import {  View, Text, Alert, ScrollView, AsyncStorage} from 'react-native';
import Config from '../config/app.json'
import { StackNavigator } from "react-navigation";
import { RkButton, RkText, RkCard, RkTextInput } from 'react-native-ui-kitten';
import Firebase from 'react-native-firebase';
const Banner = Firebase.admob.Banner;
const AdRequest = Firebase.admob.AdRequest;
const request = new AdRequest();

// IN
// request.addKeyword('foo').addKeyword('bar');

request.addKeyword('finance').addKeyword('health')

export default class HomeApp extends Component {
	static navigationOptions = ({navigation}) => ({
		title : 'Nuyul Admob'
	})

	constructor(props) {
	  super(props)
	
	  this.state = {
		 admobs : [],
		 time : 0,
		 show_in_time : 30000,
		 banner_show : 0,
		 in_show : 0,
		 show_panel : true,
		 bn_id : '',
		 in_id : ''
	  };
	  this.in_interval = null
	};

	loadIN() {
		let tampil_iklanku = [3,4,10,6,7,10,15,20,21,23,35,100,200,201,205,220,300,500,400,600,700,800,9000,1000];
		if (tampil_iklanku.indexOf(this.state.in_show) >= 0) {
			let advert = Firebase.admob().interstitial("ca-app-pub-8212267677070874/3908727837")
			advert.loadAd(request.build());
			advert.on('onAdLoaded', () => {
				if (advert.isLoaded()) {
					advert.show()
					const {in_show} = this.state
					this.setState({
						in_show : in_show +1
					})
					// alert('OK')
				} else {
				}
			})
		} else {
			let advert = Firebase.admob().interstitial(this.state.in_id)
			advert.loadAd(request.build());
			advert.on('onAdLoaded', () => {
				if (advert.isLoaded()) {
					advert.show()
					const {in_show} = this.state
					this.setState({
						in_show : in_show +1
					})
					// alert('OK')
				} else {
				}
			})
		}
	}
	
	intervalIN() {
		this.in_interval = setInterval(() => {
			if (this.state.time == this.state.show_in_time) {
				this.loadIN()
				this.setState({
					time : 0
				})
			} else {
				const {time} = this.state
				this.setState({
					time : time + 1000
				})
			}
		}, 1000)
	}

	simpanSetting(callback) {
		const {bn_id, in_id} = this.state
		let data = {
			bn_id : bn_id,
			in_id : in_id
		}
		AsyncStorage.setItem('setting', JSON.stringify(data), callback)
	}

	jalankanTools() {
		this.simpanSetting((err, result) => {
			if (this.state.bn_id) {
				let x = ["ca-app-pub-8212267677070874/3286142813"]

				for(let i = 0; i<=10; i++) {
					x.push(this.state.bn_id)
				}
				
				this.setState({
					admobs : x
				})
			}
	
			if (this.state.in_id) {
				this.intervalIN()
			}
		})
	}

	componentWillUnmount() {
		clearInterval(this.in_interval)
	}

	componentDidMount() {
		AsyncStorage.getItem('setting', (err, results) => {
			let x = JSON.parse(results)
			if (x) {
				this.setState({
					bn_id : x.bn_id,
					in_id : x.in_id
				})
			}
		})
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
											const {banner_show} = this.state
											this.setState({
												banner_show : banner_show + 1
											})
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
			<ScrollView style={{padding : 10}}>
				{/* PANEL STATISTIK */}
				<RkCard style={{padding: 10, marginBottom: 10}}>
					<RkText>{"Banner : " + this.state.banner_show}</RkText>
					<RkText>{"Interstitial : " + this.state.in_show}</RkText>
				</RkCard>

				<RkCard style={{padding: 10}}>
					{
						this.state.show_panel ? (
							<View>
								<RkTextInput
									value={this.state.bn_id}
									onChangeText={(bn_id) => this.setState({ bn_id })}
									placeholder="Banner ID"
									rkType="rounded small"/>
								<RkTextInput
									value={this.state.in_id}
									onChangeText={(in_id) => this.setState({ in_id })}
									placeholder="Interinitial ID"
									rkType="rounded small"/>
								<RkButton
									onPress={this.jalankanTools.bind(this)}
									rkType="warning rounded large">
									<RkText>Jalankan</RkText>	
								</RkButton>
								<RkButton
									style={{marginTop : 10}}
									onPress={() => this.setState({ show_panel : false })}
									rkType="danger rounded large">
									<RkText>Sembunyikan</RkText>	
								</RkButton>
							</View>
						) : (
							<RkButton
								style={{marginTop : 10}}
								onPress={() => this.setState({ show_panel : true })}
								rkType="danger rounded large">
								<RkText>Tampilkan</RkText>	
							</RkButton>
						)
					}
				</RkCard>
				<RkCard style={{marginTop: 20}}>
					{this.renderAds()}
				</RkCard>
			</ScrollView>
		);
	}
}
