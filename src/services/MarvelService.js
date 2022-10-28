 

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=5e71aeefead0f81920c8d6dc52f22ff5';
    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Couldn't fetch ${url}, status ${res.status}`);
        }

        return res.json();
    }

    getAllCharacters = async () => {
        let res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
        return res.data.results.map(this._transformChar);
    }

    getSomeCharacters = async (limit) => {
        let res = await this.getResource(`${this._apiBase}characters?limit=${limit}&offset=210&${this._apiKey}`);
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
            name: char.name.length > 19 ? char.name.slice(0, 19) + '...' : char.name,
            description: char.description.length > 80 ? char.description.slice(0, 180) + "..." : char.description || 'Ups... There is no description for this Hero...',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url
        }
    }




//     _transformCharList = (list) => {
//         return list.map(item => ({ 
//             name: item.name,
//             thumbnail: item.thumbnail.path + '.' + item.thumbnail.extension
//         }))
//     }
}


export default MarvelService; 
