'use strict';

import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
} from 'react-native';

export default class Badge extends React.Component {

  render() {
      if(!this.props.num || this.props.num == 0) {
        return null;
      }
      return (
          <View style={styles.badgeContainer}>
              <Text style={styles.badge}>{this.props.num}</Text>
          </View>
      )
  }
}

let styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    right: 16,
    top: 20,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'rgb(246, 75, 48)',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 17 / 2,
    zIndex: 3
  },
  badge: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    overflow: 'hidden'
  }
});
