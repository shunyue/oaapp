import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';



export default class Loading extends Component  {

  constructor(props) {
    super();
    this.state = {

    };
  }

  /* eslint react/no-did-mount-set-state: 0 */

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            color="white"
            size="large"
          />
          <Text style={styles.textStyle}>加载中...</Text>
          </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  textStyle: {
    color: '#fff',
    marginTop: 6
  }
});