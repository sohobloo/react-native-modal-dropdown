# react-native-modal-dropdown

A react-native dropdown/picker/selector component for both Android & iOS.

## Fuatures

- Pure JS.
- Compatable with both iOS and Android.
- Auto position. (Won't be covered or clipped by the edge of screen.)
- Zero configuration. (Options are needed of course or a loading indicator will show.)
- Highly customizable. 
- Controllable with API by code. (Show/Hide/Select)

## Demo

<img src="https://github.com/sohobloo/react-native-modal-dropdown/blob/master/docs/demo_1.gif?raw=true" width = "160" height = "287.5" alt="Demo 1"/>
<img src="https://github.com/sohobloo/react-native-modal-dropdown/blob/master/docs/demo_2.gif?raw=true" width = "160" height = "287.5" alt="Demo 2"/>
<img src="https://github.com/sohobloo/react-native-modal-dropdown/blob/master/docs/demo_3.gif?raw=true" width = "160" height = "287.5" alt="Demo 3"/> 

You can find them in the example.

## Install

```sh
npm i react-native-modal-dropdown --save
```

## Usage

### Basic

Import this module:

```js
import ModalDropdown from 'react-native-modal-dropdown';
```

Use as a component:

```js
<ModalDropdown options={['option 1', 'option 2']}/>
```

### Customization

Give the style props as your choice:
- `style`: Change the style of the button.
- `textStyle`: Change the style of text of the button.
- `dropdownStyle`: Change the style of dropdown container.

You can also render your option row by implement the `renderRow` function.

## API

### Props

Prop               | Type     | Optional | Default   | Description
------------------ | -------- | -------- | --------- | -----------
disabled           | bool     | Yes      | false     | disable/enable the component.
defaultIndex       | number   | Yes      | -1        | Init selected index. `-1`: None is selected. **This only change the highlight of the dropdown row, you have to give a `defaultValue` to change the init text.**
defaultValue       | string   | Yes      | Please select... | Init text of the button.
options            | arrayOf(string) | Yes      |           | Options. **The dropdown will show a loading indicator if `options` is `null/undefined`.**
style              | object   | Yes      |           | Style of the button.
textStyle          | object   | Yes      |           | Style of the button text.
dropdownStyle      | object   | Yes      |           | Style of the dropdown list.
renderRow          | func     | Yes      |           | Customize render option rows. Will render a default row if `null/undefined`.
onDropdownWillShow | func     | Yes      |           | Trigger when dropdown will show by touching the button. Return `false` can cancel the event.
onDropdownWillHide | func     | Yes      |           | Trigger when dropdown will hide by touching the button. Return `false` can cancel the event.
onSelect           | func     | Yes      |           | Trigger when option row touched with selected `index` and `value`.

### Methods

Method           |  Description
---------------- |  -----------
updatePosition() |  Manually update the position of the dropdown. <font color=red>**If your dropdown is within a scroll view, you have to call this method in `onScroll` function of the `scrollView`.**</font>
show()           |  Show the dropdown. **Won't trigger `onDropdownWillShow`.**
hide()           |  Hide the dropdown. **Won't trigger `onDropdownWillHide`.**
select(idx)      |  Select the specified option of the `idx`. **Won't trigger `onSelect`.**


## Next version

Inspired by [d-a-n/react-native-modal-picker](https://github.com/d-a-n/react-native-modal-picker/), I'd like to add the featur to make this component as a wrapper too.
