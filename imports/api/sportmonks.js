import * as https from 'https';

class SportmonksApi {
    constructor(baseUrl, tokenId) {
        this.token = tokenId;
        this.baseUrl = baseUrl;
    }

    get(endpoint, params) {
        let url = this._composeUrl(endpoint, params);
        Log.info("Fetching data from Sportmonks url: " + url);

        //Return promise with data from url
        return new Promise((resolve, reject) => {
            const request = https.get(url, response => {
                if (response && response.statusCode && (response.statusCode < 200 || response.statusCode > 299)) {
                    reject(Log.data("Failed to load Sportmonks data, status code: " + response.statusCode, response));
                }
                const body = [];
                response.on('data', (chunk) => body.push(chunk));
                response.on('end', () => resolve(JSON.parse(body.join(''))));
            });
            request.on('error', (err) => reject(Log.error("Failed to load Sportmonks data", err)));
        });
    }

    _composeUrl(endpoint, params) {
        let page;
        let newEndpoint = this.baseUrl + endpoint;
        let wrapped = endpoint.match(/\{(.*?)\}/g);
        if (wrapped) {
            let unwrapped = (wrapped) => wrapped.replace('{', '').replace('}', '');
            for (let w in wrapped) {
                let k = unwrapped(wrapped[w]);
                newEndpoint = newEndpoint.replace(wrapped[w], params[k]);
                delete params[k];
            }
        }
        newEndpoint += "?api_token=" + this.token;
        if (params && Object.keys(params).length > 0) {
            let plist = [];
            let pkeys = Object.keys(params);
            for (let p in pkeys) {
                if (pkeys[p] != 'page' && params[pkeys[p]])
                    plist.push(pkeys[p]);
                else {
                    if (pkeys[p] == 'page')
                        page = params[pkeys[p]];
                }
            }
            if (page)
                newEndpoint += "&page=" + page;
            if (plist.length > 0)
                newEndpoint += "&include=" + plist.join(',');
        }
        return newEndpoint;
    }
}
export { SportmonksApi }