const axios = require('axios');
const querystring = require('querystring');

async function getHtml(req) {
    console.log('Received request body:', req.body);

    if (!req.body.terms || !req.user || !req.user.uid) {
        return "Not enough information provided";
    }

    let terms = sanitize(req.body.terms);
    let userid = sanitize(req.user.uid);

    console.log('Terms:', terms);
    console.log('UserID:', userid);

    let theUrl = `http://localhost:3000/search/v2/?userid=${userid}&terms=${terms}`;
    let result = await callAPI('GET', theUrl, false);
    return result;
}

async function callAPI(method, url, data) {
    let noResults = 'No results found!';
    let result;

    try {
        switch (method) {
            case "POST":
                result = await axios.post(url, data);
                break;
            case "PUT":
                result = await axios.put(url, data);
                break;
            default:
                if (data) {
                    url = `${url}?${querystring.stringify(data)}`;
                }
                result = await axios.get(url);
        }
        return result.data;
    } catch (error) {
        console.error('Error calling API:', error);
        return noResults;
    }
}

function sanitize(input) {
    return input.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

module.exports = { html: getHtml };