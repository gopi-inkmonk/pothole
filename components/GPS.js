import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Constants, Location, Permissions } from 'expo';

export default class GPS extends Component {
  state = {
    location: null,
    errorMessage: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage:
          'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.accelerometerData !== nextProps.accelerometerData) {
  //     this._getLocationAsync();
  //   }
  // }

  // _getLocationAsync = async () => {
  //   let { status } = await Permissions.askAsync(Permissions.LOCATION);
  //   if (status !== 'granted') {
  //     this.setState({
  //       errorMessage: 'Permission to access location was denied',
  //     });
  //   }
  //
  //   let location = await Location.getCurrentPositionAsync({
  //     enableHighAccuracy: true,
  //   });
  //   this.props.setGPSData({ GPSData: location });
  // };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        distanceInterval: 1,
      },
      location => {
        console.log('got location', location);
        this.props.setGPSData({ GPSData: location });
      }
    );

    Location.watchHeadingAsync(compass => {
      this.props.setCompassData({ CompassData: compass });
    });
  };

  render() {
    let text = 'Waiting..';
    let compass = 'Waiting..';

    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.props.GPSData) {
      text = JSON.stringify(this.props.GPSData);
    }

    if (this.props.CompassData) {
      compass = JSON.stringify(this.props.CompassData);
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
        <Text style={styles.paragraph}>{compass}</Text>
        <TouchableOpacity
          onPress={this._getLocationAsync}
          style={styles.button}
        >
          <Text>Get Location</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
});
