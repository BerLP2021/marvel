import PropTypes from 'prop-types';
import React from 'react';

class MarvelService extends React.Component {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=5e71aeefead0f81920c8d6dc52f22ff5';
    _offset = 210;
    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Couldn't fetch ${url}, status ${res.status}`);
        }

        return res.json();
    }

    getAllCharacters = async (offset = this._offset) => {
        let res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformChar);
    }

    getSomeCharacters = async (limit, offset = this._offset) => {
        let res = await this.getResource(`${this._apiBase}characters?limit=${limit}&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(item => ({
                id: item.id,
                name: item.name,
                description: item.description,
                comics: item.comics.items,
                thumbnail: item.thumbnail.path + '.' + item.thumbnail.extension,
                homepage: item.urls[0].url,
                wiki: item.urls[1].url
            })
        );
    }

    getCharacter = async (id) => {
        let res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformChar(res.data.results[0]);
    }

    _transformChar = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description.length > 80 ? char.description.slice(0, 180) + "..." : char.description || 'Ups... There is no description for this Hero...',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items,
        }
    }
}

// MarvelService.defaultProps = {
//     _apiBase: 'https://gateway.marvel.com:443/v1/public/',
//     _apiKey: 'apikey=5e71aeefead0f81920c8d6dc52f22ff5',
//     _offset: 210
// }

export default MarvelService; 
