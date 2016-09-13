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
  Dimensions,
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
    showDropdown: false,
    defaultIndex: -1,
    defaultValue: 'Please select...',
  };

  static propTypes = {
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    showDropdown: PropTypes.bool,

    defaultIndex: PropTypes.number,
    defaultValue: PropTypes.string,
    options: PropTypes.array,

    style: PropTypes.object,
    textStyle: PropTypes.object,
    dropdownStyle: PropTypes.object,

    renderRow: PropTypes.func,

    onDropdownWillShow: PropTypes.func,
    onDropdownWillHide: PropTypes.func,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this._button = null;
    this._buttonFrame = null;

    this.state = {
      showDropdown: this.props.showDropdown,
      buttonText: this.props.defaultValue,
      selectedIndex: this.props.defaultIndex,
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
        this._buttonFrame = {x: px, y: py, w: width, h: height};
      });
    }
  }

  _renderButton() {
    return (
      <TouchableOpacity ref={button => this._button = button}
                        disabled={this.props.disabled}
                        onPress={this._onButtonPress.bind(this)}>
        <View style={[styles.button, this.props.style]}>
          <Text style={[styles.buttonText, this.props.textStyle]}
                numberOfLines={1}
                allowFontScaling={false}>
            {this.state.buttonText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  _onButtonPress() {
    if (this.props.onDropdownWillShow) {
      if (this.props.onDropdownWillShow() !== false) {
        this.setState({
          showDropdown: true,
        });
      }
    }
  }

  _renderModal() {
    if (this.state.showDropdown && this._buttonFrame) {
      let dimensions = Dimensions.get('window');
      let windowWidth = dimensions.width;
      let windowHeight = dimensions.height;
      let dropdownWidth = this.props.dropdownStyle && this.props.dropdownStyle.width ||
        this.props.style && this.props.style.width ||
        this.style.button.width;
      let dropdownHeight = this.props.dropdownStyle && this.props.dropdownStyle.height ||
        this.styles.dropdown.height;

      let buttonBottom = windowHeight - this._buttonFrame.y - this._buttonFrame.height;
      let showInBottom = buttonBottom > dropdownHeight || buttonBottom >= this._buttonFrame.y;
      let buttonRight = windowWidth - this._buttonFrame.x - this._buttonFrame.width;
      let showInLeft = buttonRight >= this._buttonFrame.x;

      let frameStyle = {
        width: dropdownWidth,
        height: dropdownHeight,
        top: showInBottom ? buttonBottom : max(0, this._buttonFrame.y - dropdownHeight),
        left: showInLeft ? this._buttonFrame.x : max(0, buttonRight - dropdownWidth),
      };

      return (
        <Modal animationType='fade'
          transparent={true}>
          <TouchableWithoutFeedback onPress={this._onModalPress}>
            <View style={styles.modal}>
              <View style={[styles.dropdown, this.props.dropdownStyle, frameStyle]}>
                {this.props.loading ? this._renderLoading() : this._renderDropdown()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
  }

  _onModalPress() {
    // TODO
  }

  _renderLoading() {
    // TODO
  }

  _renderDropdown() {
    // TODO
  }
}

const styles = StyleSheet.create({
  button: {
    height: 60,
    alignItems: 'center',
  },
  buttonText: {

  },
  modal: {
    flex: 1,
  },
  dropdown: {
    height: 300,
  },
  loading: {

  },
});