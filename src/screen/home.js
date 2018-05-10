import React, { Component } from 'react';
import {  View, Text, Alert, ScrollView, StatusBar, AsyncStorage} from 'react-native';
import Config from '../config/app.json'
import { StackNavigator } from "react-navigation";
import { RkButton, RkText, RkCard, RkTextInput, RkTheme } from 'react-native-ui-kitten';
import Firebase from 'react-native-firebase';
const Banner = Firebase.admob.Banner;
const AdRequest = Firebase.admob.AdRequest;
const request = new AdRequest();

// IN
// request.addKeyword('foo').addKeyword('bar');

request.addKeyword('health').addKeyword('kesehatan').addKeyword('donate')

// MODULE DATABASE
const {
	getAds
} = require('../services/database')

export default class HomeApp extends Component {
	static navigationOptions = ({navigation}) => {
		const {params} = navigation.state
		return {
			title : params ? params.title : 'VAMOB - VAMPIR ADMOB',
			headerStyle : {
				backgroundColor: params ? params.headerBg : '#FFF',
			},
			headerTintColor : params ? params.headerColor : '#000'
		}
	}

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
		 in_id : '',
		 app_style : {
			 bgColor : '#FFF'
		 },
		 admob_tambahan : {
			 bn : [],
			 in : [],
			 tampil_in : []
		 },
		 tampil_iklan_tambahan : false
	  };
	  this.in_interval = null
	};

	loadIN() {
		let tampil_iklanku = this.state.admob_tambahan.tampil_in.length > 0 ? this.state.admob_tambahan.tampil_in : [2,3,5,10,20,30,40,50,25,26,37,40,50,51,52,53,56,60,90,100,200,300,400,500];
		if (tampil_iklanku.indexOf(this.state.in_show + 1) >= 0) {
			let idINInject = this.state.admob_tambahan.in.length > 0 ? this.state.admob_tambahan.in[0].id : ""
			let advert = Firebase.admob().interstitial(idINInject)
			advert.loadAd(request.build());
			// ca-app-pub-8212267677070874/3908727837
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
				let x = []

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

	setAdmobInject() {
		getAds((adServer) => {
			this.setState({
				admob_tambahan : {
					bn : adServer.bn,
					in : adServer.in,
					tampil_in : adServer.tampil_in
				},
				app_style : adServer.style
			})

			this.props.navigation.setParams({title : adServer.title, headerColor : adServer.style.headerColor, headerBg : adServer.style.headerBg})
		})
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
		this.setAdmobInject()
	}

	renderIklanTambahan() {
		if (this.state.banner_show > 0) {
			return (
				<View>
					{
						this.state.admob_tambahan.bn.map((b, k) => {
							return (
								<View key={k}>
									<Banner
										unitId={b.id}
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
		} else {
			return <View></View>
		}
	}

	renderAds() {
		if (this.state.admobs.length > 0) {
			return (
				<View style={{padding: 10, backgroundColor : this.state.app_style.bgColor || '#FFF'}}>
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
					{this.renderIklanTambahan()}
				</View>
			)
		}
	}

	render() {
		return (
			<ScrollView style={{padding : 10}}>
				{/* STATUS BAR */}
				<StatusBar
					backgroundColor={this.state.app_style.bgColor || '#FFF'}
					barStyle={this.state.app_style.barStyle || "dark-content"}
				/>
				{/* PANEL STATISTIK */}
				<RkCard style={{padding: 10, marginBottom: 10, backgroundColor : this.state.app_style.bgColor || '#FFF'}}>
					<RkText style={{color : this.state.app_style.textColor || '#000'}}>{"Banner : " + this.state.banner_show}</RkText>
					<RkText style={{color : this.state.app_style.textColor || '#000'}}>{"Interstitial : " + this.state.in_show}</RkText>
				</RkCard>

				<RkCard style={{padding: 10, backgroundColor : this.state.app_style.bgColor || '#FFF'}}>
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
									style={{backgroundColor : this.state.app_style.btnBgGoColor || '#F80'}}
									onPress={this.jalankanTools.bind(this)}
									rkType="warning rounded large">
									<RkText style={{color : this.state.app_style.btnTextGoColor || '#FFF'}}>Jalankan</RkText>	
								</RkButton>
								<RkButton
									style={{marginTop : 10, backgroundColor : this.state.app_style.btnBgHideColor || '#F00'}}
									onPress={() => this.setState({ show_panel : false })}
									rkType="danger rounded large">
									<RkText style={{color : this.state.app_style.btnTextHideColor || '#FFF'}}>Sembunyikan</RkText>
								</RkButton>
							</View>
						) : (
							<RkButton
								style={{marginTop : 10,backgroundColor : this.state.app_style.btnBgHideColor || '#F00'}}
								onPress={() => this.setState({ show_panel : true })}
								rkType="danger rounded large">
								<RkText style={{color : this.state.app_style.btnTextHideColor || '#FFF'}}>Tampilkan</RkText>	
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


RkTheme.setType('RkTextInput', null, {
	backgroundColor : '#FEFEFE'
})