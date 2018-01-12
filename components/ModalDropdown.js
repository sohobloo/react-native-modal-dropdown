/**
 * Created by sohobloo on 16/9/13.
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
    scrollEnabled: PropTypes.bool,
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
    renderButtonText: PropTypes.func,

    onDropdownWillShow: PropTypes.func,
    onDropdownWillHide: PropTypes.func,
    onSelect: PropTypes.func
  };

  static defaultProps = {
    disabled: false,
    scrollEnabled: true,
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
    let buttonText = this._nextValue == null ? this.state.buttonText : this._nextValue.toString();
    let selectedIndex = this._nextIndex == null ? this.state.selectedIndex : this._nextIndex;
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
    let value = this.props.defaultValue;
    if (idx == null || this.props.options == null || idx >= this.props.options.length) {
      idx = this.props.defaultIndex;
    }

    if (idx >= 0) {
      value = this.props.options[idx].toString();
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
      const frameStyle = this._calcPosition();
      const animationType = this.props.animated ? 'fade' : 'none';
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
    const dimensions = Dimensions.get('window');
    const windowWidth = dimensions.width;
    const windowHeight = dimensions.height;

    const dropdownHeight = (this.props.dropdownStyle && StyleSheet.flatten(this.props.dropdownStyle).height) ||
      StyleSheet.flatten(styles.dropdown).height;

    const bottomSpace = windowHeight - this._buttonFrame.y - this._buttonFrame.h;
    const rightSpace = windowWidth - this._buttonFrame.x;
    const showInBottom = bottomSpace >= dropdownHeight || bottomSpace >= this._buttonFrame.y;
    const showInLeft = rightSpace >= this._buttonFrame.x;

    let style = {
      height: dropdownHeight,
      top: showInBottom ? this._buttonFrame.y + this._buttonFrame.h : Math.max(0, this._buttonFrame.y - dropdownHeight),
    };

    if (showInLeft) {
      style.left = this._buttonFrame.x;
    } else {
      const dropdownWidth = (this.props.dropdownStyle && StyleSheet.flatten(this.props.dropdownStyle).width) ||
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
      <ListView scrollEnabled={this.props.scrollEnabled}
                style={styles.list}
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
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.props.options);
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    const key = `row_${rowID}`;
    const highlighted = rowID == this.state.selectedIndex;
    const row = !this.props.renderRow ?
      (<Text style={[
        styles.rowText,
        this.props.dropdownTextStyle,
        highlighted && styles.highlightedRowText,
        highlighted && this.props.dropdownTextHighlightStyle
      ]}
      >
        {rowData}
      </Text>) :
      this.props.renderRow(rowData, rowID, highlighted);
    const preservedProps = {
      key: key,
      accessible: this.props.accessible,
      onPress: () => this._onRowPress(rowData, sectionID, rowID, highlightRow),
    };
    if (TOUCHABLE_ELEMENTS.find(name => name == row.type.displayName)) {
      const props = {...row.props};
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
        case 'TouchableOpacity':
        {
          return (
            <TouchableOpacity {...props}>
              {row.props.children}
            </TouchableOpacity>
          );
        }
        case 'TouchableWithoutFeedback':
        {
          return (
            <TouchableWithoutFeedback {...props}>
              {row.props.children}
            </TouchableWithoutFeedback>
          );
        }
        case 'TouchableNativeFeedback':
        {
          return (
            <TouchableNativeFeedback {...props}>
              {row.props.children}
            </TouchableNativeFeedback>
          );
        }
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
    const { onSelect, renderButtonText, onDropdownWillHide } = this.props;
    if (!onSelect || onSelect(rowID, rowData) !== false) {
      highlightRow(sectionID, rowID);
      this._nextValue = rowData;
      this._nextIndex = rowID;
      this.setState({
        buttonText: renderButtonText && renderButtonText(rowData) || rowData.toString(),
        selectedIndex: rowID
      });
    }
    if (!onDropdownWillHide || onDropdownWillHide() !== false) {
      this.setState({
        showDropdown: false
      });
    }
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    const key = `spr_${rowID}`;
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
