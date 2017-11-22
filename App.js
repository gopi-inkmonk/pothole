import React from 'react';
import firebase from 'firebase';
import { ref, firebaseAuth } from './config/Firebase';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
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
    now: null,
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
    const timestamp = prevArr.map(
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

    this.arr = [];
    // this.saveToFirebase({
    //   accelerometerX,
    //   accelerometerY,
    //   accelerometerZ,
    //   gyroscopeX,
    //   gyroscopeY,
    //   gyroscopeZ,
    //   timestamp,
    //   altitude,
    //   latitude,
    //   longitude,
    //   GPSAccuracy,
    //   speed,
    //   heading,
    //   CompassAccuracy,
    //   magHeading,
    //   trueHeading,
    // });
    this.saveAsString(
      JSON.stringify({
        accelerometerX,
        accelerometerY,
        accelerometerZ,
        gyroscopeX,
        gyroscopeY,
        gyroscopeZ,
        timestamp,
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
    const filename = `${FileSystem.documentDirectory}myfile.txt`;

    await FileSystem.writeAsStringAsync(filename, str);
    const GetInfo = await FileSystem.getInfoAsync(filename);

    const ReadData = await FileSystem.readAsStringAsync(filename);

    console.log('GetInfo', GetInfo);
    console.log('Saved data', ReadData);

    // Create a storage ref
    // const storageRef = firebase.storage().ref('data/');

    //Upload file
    // storageRef.put(filename);
  };

  /*saveToFirebase = str => {
    console.log('saving', str);
    alert(`Saving ${str}`);

    console.log('Saving', str);
    const timeStamp = str.timestamp;
    const updates = {};

    updates['accelerometerX'] = str.accelerometerX;
    updates['accelerometerY'] = str.accelerometerY;
    updates['accelerometerZ'] = str.accelerometerZ;
    updates['gyroscopeX'] = str.gyroscopeX;
    updates['gyroscopeY'] = str.gyroscopeY;
    updates['gyroscopeZ'] = str.gyroscopeZ;
    updates['timestamp'] = str.timestamp;
    updates['altitude'] = str.altitude;
    updates['latitude'] = str.latitude;
    updates['longitude'] = str.longitude;

    return firebase
      .database()
      .ref()
      .child(`/${timeStamp}/`)
      .update(updates)
      .then(() => {
        alert('Name successfully saved');
      });
  };*/

  // async componentDidMount() {
  //   this.timer = setTimeout(() => {
  //     this.flushData();
  //   }, 6000);
  // }

  // componentWillUnmount() {
  //   clearTimeout(this.timer);
  // }

  setGyroscopeData = ({ gyroscopeData }) =>
    this.setState({ gyroscopeData, now: Date.now() });
  setAccelerometerData = ({ accelerometerData }) =>
    this.setState({ accelerometerData, now: Date.now() });
  setGPSData = ({ GPSData }) => this.setState({ GPSData, now: Date.now() });
  setCompassData = ({ CompassData }) =>
    this.setState({ CompassData, now: Date.now() });

  render() {
    const {
      gyroscopeData,
      accelerometerData,
      GPSData,
      CompassData,
      now,
    } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          <View>
            <Text>Time now {now}</Text>
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
