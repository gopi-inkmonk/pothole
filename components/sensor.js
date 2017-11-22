import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { decorator as sensors } from 'react-native-sensors';

class Sensor {
  // no lifecycle needed
  render() {
    const { Accelerometer, Gyroscope } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Acceleration has value: {Accelerometer}
          Gyro has value: {Gyroscope}
        </Text>
      </View>
    );
  }
}

export default sensors({
  Accelerometer: {
    updateInterval: 300, // optional
  },
  Gyroscope: true,
})(Sensor);
