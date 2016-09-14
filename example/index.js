/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import ModalDropdown from 'react-native-modal-dropdown';

const DEMO_OPTIONS_1 = ['option 1', 'option 2', 'option 3', 'option 4', 'option 5', 'option 6', 'option 7', 'option 8',];

class Demo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <ModalDropdown style={{top: 8, left: 8}}
                           options={DEMO_OPTIONS_1}
            />
          </View>
          <View style={styles.cell}>
            <ModalDropdown style={{top: 8, right: 8}}
                           options={DEMO_OPTIONS_1}
            />
          </View>
        </View>
        <View style={styles.row}>

        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <ModalDropdown style={{bottom: 8, left: 8}}
                           options={DEMO_OPTIONS_1}
            />
          </View>
          <View style={styles.cell}>
            <ModalDropdown style={{bottom: 8, right: 8}}
                           options={DEMO_OPTIONS_1}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

AppRegistry.registerComponent('Demo', () => Demo);