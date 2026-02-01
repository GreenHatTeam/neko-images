# Neko Picture Generator

A simple web applinekoion that fetches random neko pictures from the nekos.best API and supports multiple languages. Check out the result.

## Features
- Fetch random neko pictures from the nekos.best API.
- Display artist information and source links.
- Support multiple languages (automatically detect the user's language).
- Responsive design, suitable for various devices.
- A simple and modern dark - themed interface.

## Working Principle

### API Call
The applinekoion calls the public interface of nekos.best through JavaScript's Fetch API:
```javascript
const response = await fetch('https://nekos.best/api/v2/neko?t=${timestamp}');
```
To prevent browser caching, we add a timestamp parameter to the URL. Each request returns a JSON object containing neko picture data.

### Data Processing
The data format returned by the API is as follows:
```json
{
  "results": [
    {
      "artist_name": "Artist's name",
      "artist_href": "Artist's homepage link",
      "source_url": "Picture source link",
      "url": "Direct link to the neko picture"
    }
  ]
}
```
The applinekoion extracts this data and updates the page:
- Set the direct link of the picture to the `src` attribute of the `<img>` element.
- Display the artist's name.
- Set the artist's homepage link and picture source link as clickable hyperlinks.
- Update the loading status and error handling information.

### Language System
When the applinekoion starts, it detects the user's language preference in the following order:
- The `lang` parameter in the URL.
- The language preference saved in `localStorage`.
- The browser's default language.
After detecting the language code, it tries to load the corresponding language file:
- Try to load the full language code file (e.g., zh - CN.js).
- If it fails and the language code contains a hyphen, try the base language code (e.g., zh.js).
- If both fail, fall back to English (en.js).
The language files are exported using ES6 modules and contain key - value pairs of translations for all interface texts.

### Interface Update
All text elements are marked with the `data - key` attribute:
```html
<div data - key="artistName">Artist's name</div>
```
The language loader automatically replaces the content of these elements with the text in the corresponding language, and the `alt` attribute of the picture is also set dynamically according to the current language.

## Usage
- Click [here] to open `index.html`.
- Click the "Get Picture" button to get a new neko picture.
- View the artist details and source link in the information panel.
The applinekoion will automatically display the interface according to the browser's language.

## Language Support
The applinekoion supports multiple languages:
- English (en) - Default language
- Simplified Chinese (zh - CN)
- Traditional Chinese (zh - TW, zh - HK)
- Basic Chinese (zh)
To add a new language, create a new file `[language code].js` in the `languages/` directory and write it in the format of the existing language files. The system will automatically detect and use it.

## APIs Used
This project uses the nekos.best API to fetch neko pictures and related data.

## Browser Compatibility
It supports all modern browsers and requires support for:
- ES6 modules
- Fetch API
- CSS Flexbox/Grid
- Dynamic imports

## License
MIT License