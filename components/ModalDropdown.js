/**
 * Created by sohobloo on 16/9/13.
 * Forked and edited by b1gnasty in Nov 2017
 */

'use strict';

import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ListView,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  ActivityIndicator,
} from 'react-native';

const PropTypes = require('prop-types');

const TOUCHABLE_ELEMENTS = ['TouchableHighlight', 'TouchableOpacity', 'TouchableWithoutFeedback', 'TouchableNativeFeedback'];

export default class ModalDropdown extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    defaultIndex: PropTypes.number,
    defaultValue: PropTypes.string,
    options: PropTypes.array,

    accessible: PropTypes.bool,
    animated: PropTypes.bool,
    showsVerticalScrollIndicator: PropTypes.bool,
    keyboardShouldPersistTaps: PropTypes.string,

    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    dropdownStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    dropdownTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    dropdownTextHighlightStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

    adjustFrame: PropTypes.func,
    renderRow: PropTypes.func,
    renderSeparator: PropTypes.func,

    onDropdownWillShow: PropTypes.func,
    onDropdownWillHide: PropTypes.func,
    onSelect: PropTypes.func
  };

  static defaultProps = {
    disabled: false,
    defaultIndex: -1,
    defaultValue: 'Please select...',
    options: null,
    animated: true,
    showsVerticalScrollIndicator: true,
    keyboardShouldPersistTaps: 'never'
  };

  constructor(props) {
    super(props);

    this._button = null;
    this._buttonFrame = null;
    this._nextValue = null;
    this._nextIndex = null;

    this.state = {
      disabled: props.disabled,
      accessible: !!props.accessible,
      loading: props.options === null || props.options === undefined,
      showDropdown: false,
      buttonText: props.defaultValue,
      selectedIndex: props.defaultIndex
    };
  }

  componentWillReceiveProps(nextProps) {
    var buttonText = this._nextValue == null ? this.state.buttonText : this._nextValue.toString();
    var selectedIndex = this._nextIndex == null ? this.state.selectedIndex : this._nextIndex;
    if (selectedIndex < 0) {
      selectedIndex = nextProps.defaultIndex;
      if (selectedIndex < 0) {
        buttonText = nextProps.defaultValue;
      }
    }
    this._nextValue = null;
    this._nextIndex = null;

    this.setState({
      disabled: nextProps.disabled,
      loading: nextProps.options == null,
      buttonText: buttonText,
      selectedIndex: selectedIndex
    });
  }

  render() {
    return (
      <View {...this.props}>
        {this._renderButton()}
        {this._renderModal()}
      </View>
    );
  }

  _updatePosition(callback) {
    if (this._button && this._button.measure) {
      this._button.measure((fx, fy, width, height, px, py) => {
        this._buttonFrame = {x: px, y: py, w: width, h: height};
        callback && callback();
      });
    }
  }

  show() {
    this._updatePosition(() => {
      this.setState({
        showDropdown: true
      });
    });
  }

  hide() {
    this.setState({
      showDropdown: false
    });
  }

  select(idx) {
    var value = this.props.defaultValue.toString();
    if (idx == null || this.props.options == null || idx >= this.props.options.length) {
      idx = this.props.defaultIndex;
    }

    if (idx >= 0) {
      value = this.props.options[idx].value.toString();
    }

    this._nextValue = value;
    this._nextIndex = idx;

    this.setState({
      buttonText: value,
      selectedIndex: idx
    });
  }

  _renderButton() {
    return (
      <TouchableOpacity ref={button => this._button = button}
                        disabled={this.props.disabled}
                        accessible={this.props.accessible}
                        onPress={this._onButtonPress.bind(this)}>
        {
          this.props.children ||
          (
            <View style={styles.button}>
              <Text style={[styles.buttonText, this.props.textStyle]}
                    numberOfLines={1}>
                {this.state.buttonText}
              </Text>
            </View>
          )
        }
      </TouchableOpacity>
    );
  }

  _onButtonPress() {
    if (!this.props.onDropdownWillShow ||
      this.props.onDropdownWillShow() !== false) {
      this.show();
    }
  }

  _renderModal() {
    if (this.state.showDropdown && this._buttonFrame) {
      let frameStyle = this._calcPosition();
      let animationType = this.props.animated ? 'fade' : 'none';
      return (
        <Modal animationType={animationType}
               visible={true}
               transparent={true}
               onRequestClose={this._onRequestClose.bind(this)}
               supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}>
          <TouchableWithoutFeedback accessible={this.props.accessible}
                                    disabled={!this.state.showDropdown}
                                    onPress={this._onModalPress.bind(this)}>
            <View style={styles.modal}>
              <View style={[styles.dropdown, this.props.dropdownStyle, frameStyle]}>
                {this.state.loading ? this._renderLoading() : this._renderDropdown()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
  }

  _calcPosition() {
    let dimensions = Dimensions.get('window');
    let windowWidth = dimensions.width;
    let windowHeight = dimensions.height;

    let dropdownHeight = (this.props.dropdownStyle && StyleSheet.flatten(this.props.dropdownStyle).height) ||
      StyleSheet.flatten(styles.dropdown).height;

    let bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
    let rightSpace = windowWidth - this._buttonFrame.x;
    let showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
    let showInLeft = rightSpace >= this._buttonFrame.x;

    var style = {
      height: dropdownHeight,
      top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight),
    };

    if (showInLeft) {
      style.left = this._buttonFrame.x;
    } else {
      let dropdownWidth = (this.props.dropdownStyle && StyleSheet.flatten(this.props.dropdownStyle).width) ||
        (this.props.style && StyleSheet.flatten(this.props.style).width) || -1;
      if (dropdownWidth !== -1) {
        style.width = dropdownWidth;
      }
      style.right = rightSpace - this._buttonFrame.w;
    }

    if (this.props.adjustFrame) {
      style = this.props.adjustFrame(style) || style;
    }

    return style;
  }

  _onRequestClose() {
    if (!this.props.onDropdownWillHide ||
      this.props.onDropdownWillHide() !== false) {
      this.hide();
    }
  }

  _onModalPress() {
    if (!this.props.onDropdownWillHide ||
      this.props.onDropdownWillHide() !== false) {
      this.hide();
    }
  }

  _renderLoading() {
    return (
      <ActivityIndicator size='small'/>
    );
  }

  _renderDropdown() {
    return (
      <ListView style={styles.list}
                dataSource={this._dataSource}
                renderRow={this._renderRow.bind(this)}
                renderSeparator={this.props.renderSeparator || this._renderSeparator.bind(this)}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={this.props.showsVerticalScrollIndicator}
                keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
      />
    );
  }

  get _dataSource() {
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.props.options);
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    let key = `row_${rowID}`;
    let highlighted = rowID == this.state.selectedIndex;
    let row = !this.props.renderRow ?
      (<Text style={[
        styles.rowText,
        this.props.dropdownTextStyle,
        highlighted && styles.highlightedRowText,
        highlighted && this.props.dropdownTextHighlightStyle
      ]}
      >
        {rowData.label}
      </Text>) :
      this.props.renderRow(rowData, rowID, highlighted);
    let preservedProps = {
      key: key,
      accessible: this.props.accessible,
      onPress: () => this._onRowPress(rowData, sectionID, rowID, highlightRow),
    };
    if (TOUCHABLE_ELEMENTS.find(name => name == row.type.displayName)) {
      var props = {...row.props};
      props.key = preservedProps.key;
      props.onPress = preservedProps.onPress;
      switch (row.type.displayName) {
        case 'TouchableHighlight':
        {
          return (
            <TouchableHighlight {...props}>
              {row.props.children}
            </TouchableHighlight>
          );
        }
          break;
        case 'TouchableOpacity':
        {
          return (
            <TouchableOpacity {...props}>
              {row.props.children}
            </TouchableOpacity>
          );
        }
          break;
        case 'TouchableWithoutFeedback':
        {
          return (
            <TouchableWithoutFeedback {...props}>
              {row.props.children}
            </TouchableWithoutFeedback>
          );
        }
          break;
        case 'TouchableNativeFeedback':
        {
          return (
            <TouchableNativeFeedback {...props}>
              {row.props.children}
            </TouchableNativeFeedback>
          );
        }
          break;
        default:
          break;
      }
    }
    return (
      <TouchableHighlight {...preservedProps}>
        {row}
      </TouchableHighlight>
    );
  }

  _onRowPress(rowData, sectionID, rowID, highlightRow) {
    if (!this.props.onSelect ||
      this.props.onSelect(rowID, rowData) !== false) {
      highlightRow(sectionID, rowID);
      this._nextValue = rowData.value;
      this._nextIndex = rowID;
      this.setState({
        buttonText: rowData.label.toString(),
        selectedIndex: rowID
      });
    }
    if (!this.props.onDropdownWillHide ||
      this.props.onDropdownWillHide() !== false) {
      this.setState({
        showDropdown: false
      });
    }
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    let key = `spr_${rowID}`;
    return (<View style={styles.separator}
                  key={key}
    />);
  }
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 12
  },
  modal: {
    flexGrow: 1
  },
  dropdown: {
    position: 'absolute',
    height: (33 + StyleSheet.hairlineWidth) * 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
    borderRadius: 2,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  loading: {
    alignSelf: 'center'
  },
  list: {
    //flexGrow: 1,
  },
  rowText: {
    paddingHorizontal: 6,
    paddingVertical: 10,
    fontSize: 11,
    color: 'gray',
    backgroundColor: 'white',
    textAlignVertical: 'center'
  },
  highlightedRowText: {
    color: 'black'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'lightgray'
  }
});
