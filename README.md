This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.<br />

### Terms and Requirements

–– Input
1. **itemsUrl**
This will be the URL of any endpoint which returns a JSON Body matching the Carousel Schema
2. **itemsJson**
This will be a JSON blob, containing an object matching the Carousel Schema
3. **App Input Data Fields**

–– Output
1. **selectedItem**
If the user selects a postback type button, the payload value of that button will
be set to this variable
2. **errorMessage**
Error messages that occurred in the widget.

–– Parameters priority in descending order (at least one is required)
1. itemsUrl
2. itemsJson (should be formatted & valid. Use tools like [https://jsonformatter.curiousconcept.com/](https://jsonformatter.curiousconcept.com/))
3. App Input Data Fields

–– Avoid camelCase in data keys because it will parse like separate keys. The parsing algorithm works as follows: mediaUrl → media_url (by ADA platform)→ media.url (by the widget).

–– There is a required minimum data per slide for App Input Data Fields

![alt text](https://live.staticflickr.com/65535/50522399188_646daeb3db_h.jpg "params")