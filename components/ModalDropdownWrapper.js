import React from 'react';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import ModalDropdown from './ModalDropdown';

const ModalDropdownWrapper = (props) => {
    const frame = useSafeAreaFrame();

    return <ModalDropdown androidWindowHeight={frame.height} {...props} />
}

export default ModalDropdownWrapper;