# ContextMenu Library Documentation

## Overview
The `ContextMenu` library provides an easy way to create customizable and responsive context menus for web applications. This library supports both desktop and mobile devices, ensuring a smooth user experience.

## Installation
Import the `ContextMenu` library and its associated styles and assets into your project:
```javascript
import "./hi-menu.css";
import ContextMenu from "./hi-menu";
```

## Usage
### Basic Initialization
Create a new context menu for a specific element by providing its selector ID:
```javascript
const menu = new ContextMenu("#myElement", (event) => {
  console.log("Context menu triggered", event);
});
```
This code will initialize a context menu on the element with the ID `myElement`.

### Adding Menu Items
Add items to the context menu using the `add` method:
```javascript
menu.add("Option 1", (event) => {
  alert("Option 1 clicked");
});

menu.add("Option 2", () => {
  console.log("Option 2 clicked");
});
```
Each menu item can have a label and an action callback.

### Adding Submenus
To create submenus, pass an array of items as the `submenuItems` parameter:
```javascript
menu.add("Parent Option", null, [
  { label: "Child Option 1", action: () => alert("Child 1") },
  { label: "Child Option 2", action: () => alert("Child 2") },
]);
```

### Adding Titles
Set a title for the menu using the `title` method:
```javascript
menu.title("My Custom Menu", "left");
```
The second parameter defines the text alignment (`left`, `center`, `right`).

### Handling Focus and Blur Events
You can listen to focus and blur events on the context menu elements:
```javascript
menu.onFocus((event) => {
  console.log("Element focused", event.target);
});

menu.onBlur((event) => {
  console.log("Element blurred", event.target);
});
```

## Mobile Support
For devices with smaller screens, the context menu is centered on the screen and includes a backdrop to enhance usability.

## Example
Here is a complete example of creating a custom context menu:
```javascript
const contextMenu = new ContextMenu(".clickable-item", (event) => {
  console.log("Context menu opened for", event.target);
});

contextMenu.title("Options");

contextMenu.add("Edit", () => {
  alert("Edit option clicked");
});

contextMenu.add("Delete", () => {
  alert("Delete option clicked");
});

contextMenu.add("More", null, [
  { label: "Sub Option 1", action: () => alert("Sub Option 1 clicked") },
  { label: "Sub Option 2", action: () => alert("Sub Option 2 clicked") },
]);
```

## Methods
### `hideMenu()`
Hides the context menu and the backdrop.

### `setLongpressEvent()`
Enables long-press event handling for mobile devices.

### `setToElement(callback)`
Applies the provided callback function to all elements targeted by the context menu.

## Conclusion
The `ContextMenu` library is a versatile tool for adding custom context menus to your web application, offering rich features and customization options to suit a variety of use cases.

