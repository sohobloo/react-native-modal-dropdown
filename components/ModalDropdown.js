/**
 * Created by raoxin on 16/9/13.
 */

'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text,
  ListView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  NativeModules,
} from 'react-native';

export default class ModalDropdown extends Component {
  static defaultProps = {
    loading: true,
    disabled: false,
    showModal: false,
  };

  static propTypes = {
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    showDropdown: PropTypes.bool,

    options: PropTypes.array,
    selectedValue: PropTypes.object,

    onDropdownWillShow: PropTypes.func,
    onDropdownWillHide: PropTypes.func,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this._button = null;
    this._position = {x:0, y:0, w:0, h:0};

    this.state = {
      loading: this.props.loading,
      disabled: this.props.disabled,
      showDropdown: this.state.showDropdown,
    };
  }

  componentDidMount() {
    setTimeout(() => this.updatePosition(), 0);
  }

  componentDidUpdate() {
    setTimeout(() => this.updatePosition(), 0);
  }

  render() {
    return (
      <View style={this.props.style}>
        {this._renderButton()}
        {this._renderModal()}
      </View>
    );
  }

  updatePosition() {
    if (this._button && this._button.measure) {
      this._button.measure((fx, fy, width, height, px, py) => {
        this._position = {x:px, y:py, w:width, h:height};
      });
    }
  }
}