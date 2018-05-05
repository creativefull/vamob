import React, { Component } from 'react';

import {
	StackNavigator
} from 'react-navigation';

import Splash from './screen/splash';
import Signup from './screen/signup';
import Home from './screen/home'
import Home2 from './screen/home2'

const AppHome = StackNavigator({
	Home : {
		screen : Home
	},
	Home2 : {
		screen : Home2
	}
}, {
	initialRouteName : 'Home'
})

const App = StackNavigator({
	Signup : {
		screen : Signup
	},
	Splash : {
		screen : Splash
	}
}, {
	initialRouteName : 'Splash'
})

export default AppHome