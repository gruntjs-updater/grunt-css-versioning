CSS versioning plugin for grunt.

## Description

This is just a beta version that was created as a prototype for some research.

## Installation

To install it you can simply clone it to your project node modules.

## Usage example

Here is the usage example.

The task works with several css files, which are named according to predefined rules (you can change it if you want).
That files can look this way:

myComponent.css:

```css
    myComponent {
        color: #3B3B3B;
    }

    myComponent a.link {
        border: 1px solid #333;
    }
```

myComponent--v2.css:

```css
    .myComponent {
        color: #000;
    }

    .myComponent a.link {
        border: 1px solid #bbb;
    }
```

myComponent--v3.css:

```css
    .myComponent {
        color: #3A2A1A;
    }

    .myComponent a.link {
        border: 4px solid #3b001F;
    }
```

Using the task you will have the following output:

```css
    .myComponent {
        color: #3B3B3B;
    }

    .myComponent a.link {
        border: 1px solid #333;
    }

    .v2--myComponent {
        color: #000;
    }

    .v2--myComponent a.link {
        border: 1px solid #bbb;
    }

    .v3--myComponent {
        color: #3A2A1A;
    }

    .v3--myComponent a.link {
        border: 4px solid #3b001F;
    }
```
Unfortunately, right now the task can't merge css classes to avoid extra defenitions.

## Options

### separator

|**Parameter**|Value|
| ------------- | ------- |
|**Name**|separator|
|**Type**|`String`|
|**Descriptions**|Defines the way of splitting for component name and version. RegExp part.|
|**Default value**|`"--"`|

N.B. Please use it carefully, because it is a part of regular expression.

### mergeVersion

|**Parameter**|Value|
| ------------- | ------- |
|**Name**|mergeVersion|
|**Type**|`Boolean`|
|**Descriptions**|Defines if we are to write all versioned css rules into component file|
|**Default value**|`true`|


N.B. This regExp is used to get array [fileName, componentName, versioningToken, extention] array.
For example ["component--v2.css", "component", "v2", "css"] for component--v2.css file.

## License

MIT
