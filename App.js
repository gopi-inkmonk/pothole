import React from 'react';
import firebase from 'firebase';
import { ref, firebaseAuth } from './config/Firebase';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Clipboard,
} from 'react-native';
import { FileSystem } from 'expo';
import AccelerometerSensor from './components/AccelerometerSensor';
import GyroscopeSensor from './components/GyroscopeSensor';
import GPS from './components/GPS';

export default class App extends React.Component {
  state = {
    accelerometerData: {},
    gyroscopeData: {},
    GPSData: null,
    CompassData: null,
    TimeStamp: null,
  };

  arr = [];

  constructor(props) {
    super(props);
    const prevSetState = this.setState.bind(this);
    this.setState = obj => {
      this.arr.push({ ...this.state, ...obj });

      prevSetState(obj);
    };
  }

  flushData = () => {
    const prevArr = this.arr;

    // Accelerometer data
    const accelerometerX = prevArr.map(
      x => (x.accelerometerData && x.accelerometerData.x) || ''
    );
    const accelerometerY = prevArr.map(
      x => (x.accelerometerData && x.accelerometerData.y) || ''
    );
    const accelerometerZ = prevArr.map(
      x => (x.accelerometerData && x.accelerometerData.z) || ''
    );

    // Gyroscope data
    const gyroscopeX = prevArr.map(
      x => (x.gyroscopeData && x.gyroscopeData.x) || ''
    );
    const gyroscopeY = prevArr.map(
      x => (x.gyroscopeData && x.gyroscopeData.y) || ''
    );
    const gyroscopeZ = prevArr.map(
      x => (x.gyroscopeData && x.gyroscopeData.z) || ''
    );

    // Gps Data
    const GPSTimestamp = prevArr.map(
      x => (x.GPSData && x.GPSData.timestamp) || ''
    );
    const altitude = prevArr.map(x => (x.GPSData && x.GPSData.altitude) || '');
    const latitude = prevArr.map(x => (x.GPSData && x.GPSData.latitude) || '');
    const longitude = prevArr.map(
      x => (x.GPSData && x.GPSData.longitude) || ''
    );
    const GPSAccuracy = prevArr.map(
      x => (x.GPSData && x.GPSData.accuracy) || ''
    );
    const speed = prevArr.map(x => (x.GPSData && x.GPSData.speed) || '');
    const heading = prevArr.map(x => (x.GPSData && x.GPSData.heading) || '');

    // Compass Data
    const CompassAccuracy = prevArr.map(
      x => (x.CompassData && x.CompassData.accuracy) || ''
    );
    const magHeading = prevArr.map(
      x => (x.CompassData && x.CompassData.magHeading) || ''
    );
    const trueHeading = prevArr.map(
      x => (x.CompassData && x.CompassData.trueHeading) || ''
    );

    const TimeStamp = prevArr.map(x => x.TimeStamp || '');

    this.arr = [];

    this.saveAsString(
      JSON.stringify({
        TimeStamp,
        accelerometerX,
        accelerometerY,
        accelerometerZ,
        gyroscopeX,
        gyroscopeY,
        gyroscopeZ,
        GPSTimestamp,
        altitude,
        latitude,
        longitude,
        GPSAccuracy,
        speed,
        heading,
        CompassAccuracy,
        magHeading,
        trueHeading,
      })
    ).catch(err => console.error('some error happened', err));
  };

  saveAsString = async str => {
    const filename = `${FileSystem.documentDirectory}myfile.json`;

    await FileSystem.writeAsStringAsync(filename, str);
    const GetInfo = await FileSystem.getInfoAsync(filename);

    const ReadData = await FileSystem.readAsStringAsync(filename);

    console.log('GetInfo', GetInfo);
    console.log('Saved data', ReadData);

    let upload_url = await fetch('https://dropfile.to/getuploadserver').then(
      res => res.text()
    );

    upload_url = `${upload_url.trim()}/upload`;
    console.log('got upload_url', upload_url);
    const uri = filename;
    const extension = uri.slice(uri.lastIndexOf('.') + 1);
    const info = await FileSystem.getInfoAsync(uri);
    console.log('image info', uri, info);
    const formData = new FormData();
    formData.append('file', {
      uri: filename,
      name: `data.json`,
      filename: `data.json`,
      type: 'application/json',
    });
    return fetch(upload_url, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => res.json())
      .then(json => {
        Clipboard.setString(json.url);

        alert(`Url has been copied to clipboard!\n\nurl: ${json.url}`);
      });
  };

  // async componentDidMount() {
  //   this.timer = setTimeout(() => {
  //     this.flushData();
  //   }, 6000);
  // }

  // componentWillUnmount() {
  //   clearTimeout(this.timer);
  // }

  setGyroscopeData = ({ gyroscopeData }) =>
    this.setState({ gyroscopeData, TimeStamp: Date.now() });
  setAccelerometerData = ({ accelerometerData }) =>
    this.setState({ accelerometerData, TimeStamp: Date.now() });
  setGPSData = ({ GPSData }) =>
    this.setState({ GPSData, TimeStamp: Date.now() });
  setCompassData = ({ CompassData }) =>
    this.setState({ CompassData, TimeStamp: Date.now() });

  render() {
    const {
      gyroscopeData,
      accelerometerData,
      GPSData,
      CompassData,
      TimeStamp,
    } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          <View>
            <Text>Time now {TimeStamp}</Text>
          </View>
          <AccelerometerSensor
            setAccelerometerData={this.setAccelerometerData}
            accelerometerData={accelerometerData}
          />
          <GyroscopeSensor
            setGyroscopeData={this.setGyroscopeData}
            gyroscopeData={gyroscopeData}
          />
          <GPS
            setGPSData={this.setGPSData}
            GPSData={GPSData}
            setCompassData={this.setCompassData}
            CompassData={CompassData}
          />
          <TouchableOpacity onPress={this.flushData}>
            <View style={{ margin: 20 }}>
              <Text>Save</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 25,
  },
  contentContainer: {
    flex: 1,
  },
});
