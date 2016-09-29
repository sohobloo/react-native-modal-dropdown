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
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

//import ModalDropdown from 'react-native-modal-dropdown';
import ModalDropdown from './ModalDropdown';

const DEMO_OPTIONS_1 = ['option 1', 'option 2', 'option 3', 'option 4', 'option 5', 'option 6', 'option 7', 'option 8', 'option 9'];

class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdown_4_options: null,
      dropdown_4_defaultValue: 'loading...',
      dropdown_6_icon_heart: true,
    };
  }

  render() {
    let dropdown_6_icon = this.state.dropdown_6_icon_heart ? require('./images/heart.png') : require('./images/flower.png');
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <ModalDropdown style={styles.dropdown_1}
                           options={DEMO_OPTIONS_1}
            />
            <ModalDropdown style={styles.dropdown_6}
                           options={DEMO_OPTIONS_1}
                           onSelect={(idx, value) => this._dropdown_6_onSelect(idx, value)}>
              <Image style={styles.dropdown_6_image}
                     source={dropdown_6_icon}
              />
            </ModalDropdown>
          </View>
          <View style={styles.cell}>
            <ModalDropdown style={styles.dropdown_2}
                           textStyle={styles.dropdown_2_text}
                           dropdownStyle={styles.dropdown_2_dropdown}
                           options={DEMO_OPTIONS_1}
                           renderRow={this._dropdown_2_renderRow.bind(this)}
            />
          </View>
        </View>
        <View style={styles.row}>
          <ScrollView ref={el => this._scrollView = el}
                      style={styles.scrollView}
                      contentContainerStyle={styles.contentContainer}
                      showsVerticalScrollIndicator={true}
                      onScroll={this._dropdown_3_updatePosition.bind(this)}
                      scrollEventThrottle={1}>
            <Text>
              {'You have to update dropdown position after scroll.'}
            </Text>
            <ModalDropdown ref={el => this._dropdown_3 = el}
                           style={styles.dropdown_3}
                           options={DEMO_OPTIONS_1}
            />
          </ScrollView>
        </View>
        <View style={styles.row}>
          <View style={[styles.cell, {justifyContent: 'flex-end'}]}>
            <ModalDropdown style={styles.dropdown_4}
                           dropdownStyle={styles.dropdown_4_dropdown}
                           options={this.state.dropdown_4_options}
                           defaultIndex={-1}
                           defaultValue={this.state.dropdown_4_defaultValue}
                           onDropdownWillShow={this._dropdown_4_willShow.bind(this)}
                           onDropdownWillHide={this._dropdown_4_willHide.bind(this)}
                           onSelect={(idx, value) => this._dropdown_4_onSelect(idx, value)}
            />
          </View>
          <View style={[styles.cell, {justifyContent: 'flex-end'}]}>
            <TouchableOpacity onPress={this._dropdown_5_show.bind(this)}>
              <Text style={styles.textButton}>
                {'Show dropdown'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._dropdown_5_select(2)}>
              <Text style={styles.textButton}>
                {'Select the 3rd option'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._dropdown_5_select(-1)}>
              <Text style={styles.textButton}>
                {'Clear selection'}
              </Text>
            </TouchableOpacity>
            <ModalDropdown ref={el => this._dropdown_5 = el}
                           style={styles.dropdown_5}
                           options={['Select me to hide', `I can't be selected`, 'I can only be selected outside']}
                           defaultValue='Try the Show button above'
                           onDropdownWillShow={this._dropdown_5_willShow.bind(this)}
                           onDropdownWillHide={this._dropdown_5_willHide.bind(this)}
                           onSelect={this._dropdown_5_onSelect.bind(this)}
            />
          </View>
        </View>
      </View>
    );
  }

  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    let icon = highlighted ? require('./images/heart.png') : require('./images/flower.png');
    let evenRow = rowID % 2;
    return (
      <View style={[styles.dropdown_2_row, evenRow && {backgroundColor: 'lemonchiffon'}]}>
        <Image style={styles.dropdown_2_image}
               mode='stretch'
               source={icon}
        />
        <Text style={[styles.dropdown_2_row_text, highlighted && {color: 'mediumaquamarine'}]}>
          {rowData}
        </Text>
      </View>
    );
  }

  _dropdown_3_updatePosition() {
    this._dropdown_3 && this._dropdown_3.updatePosition();
  }

  _dropdown_4_willShow() {
    setTimeout(() => this.setState({
      dropdown_4_options: DEMO_OPTIONS_1,
      dropdown_4_defaultValue: 'loaded',
    }), 2000);
  }

  _dropdown_4_willHide() {
    this.setState({
      dropdown_4_options: null,
      dropdown_4_defaultValue: 'loading',
    });
  }

  _dropdown_4_onSelect(idx, value) {
    alert(`idx=${idx}, value='${value}'`);
  }

  _dropdown_5_show() {
    this._dropdown_5 && this._dropdown_5.show();
  }

  _dropdown_5_select(idx) {
    this._dropdown_5 && this._dropdown_5.select(idx);
  }

  _dropdown_5_willShow() {
    return false;
  }

  _dropdown_5_willHide() {
    let idx = this._dropdown_5_idx;
    this._dropdown_5_idx = undefined;
    return idx == 0;
  }

  _dropdown_5_onSelect(idx, value) {
    this._dropdown_5_idx = idx;
    if (this._dropdown_5_idx != 0) {
      return false;
    }
  }

  _dropdown_6_onSelect(idx, value) {
    this.setState({
      dropdown_6_icon_heart: !this.state.dropdown_6_icon_heart,
    })
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

  scrollView: {
    flex: 1,
  },
  contentContainer: {
    height: 500,
    paddingVertical: 100,
    paddingLeft: 20,
  },
  textButton: {
    color: 'deepskyblue',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'deepskyblue',
    margin: 2,
  },

  dropdown_1: {
    flex: 1,
    top: 32,
    left: 8
  },
  dropdown_2: {
    alignSelf: 'flex-end',
    width: 150,
    top: 32,
    right: 8,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: 'cornflowerblue',
  },
  dropdown_2_text: {
    height: 40,
    lineHeight: 40,
    marginHorizontal: 6,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  dropdown_2_dropdown: {
    width: 150,
    borderColor: 'cornflowerblue',
    borderWidth: 2,
    borderRadius: 3,
  },
  dropdown_2_row: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  dropdown_2_image: {
    marginLeft: 4,
    width: 30,
    height: 30,
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: 'navy',
    textAlignVertical: 'center',
  },
  dropdown_3: {
    width: 150,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 1,
  },
  dropdown_4: {
    margin: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 1,
  },
  dropdown_4_dropdown: {
    width: 100,
  },
  dropdown_5: {
    alignSelf: 'flex-end',
    margin: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 1,
  },
  dropdown_6: {
    flex: 1,
    left: 8,
  },
  dropdown_6_image: {
    width: 40,
    height: 40,
  },
});

AppRegistry.registerComponent('Demo', () => Demo);