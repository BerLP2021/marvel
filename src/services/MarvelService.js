import {useHttp} from '../hooks/http.hook';

const useMarvelService = () => {
    const {loading, error, request, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=5e71aeefead0f81920c8d6dc52f22ff5';
    const _offset = 210;
    
    const getAllCharacters = async (offset = _offset) => {
        let res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformChar);
    }

    const getSomeCharacters = async (limit, offset = _offset) => {
        let res = await request(`${_apiBase}characters?limit=${limit}&offset=${offset}&${_apiKey}`);
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

    const getCharacter = async (id) => {
        let res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformChar(res.data.results[0]);
    }

    const getCharacterByName = async (name) => {
        let res = await request(`${_apiBase}characters?nameStartsWith=${name}&${_apiKey}`);
        return res.data.results.map(_transformChar);
    }

    const getAllComics = async (offset) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }
    
    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            name: comics.title,
            description: comics.description || "There is no description...",
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            price: (comics.prices[1]?.price || comics.prices[0].price) ? `${(comics.prices[1]?.price || comics.prices[0].price)}$`: 'not available',
            pageCount: comics.pageCount ? `${comics.pageCount} pages` : 'No information about the number of pages',
            language: comics.textObjects.language || 'en-us',
            url: comics.urls.filter(item => item.type = "detail")[0].url,
            // price: comics.prices.price ? `${comics.prices.price}$` : 'not available'
        }
    }

    const _transformChar = (char) => {
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

    const _transformSearchChar = (res) => {
        return {
            id: res.id,
            name: res.name,
            description: res.description
        }
    }

    return {
        error, loading, getCharacter, getSomeCharacters, getAllCharacters, getCharacterByName, clearError, getAllComics, getComic
    }
}

// MarvelService.defaultProps = {
//     _apiBase: 'https://gateway.marvel.com:443/v1/public/',
//     _apiKey: 'apikey=5e71aeefead0f81920c8d6dc52f22ff5',
//     _offset: 210
// }

export default useMarvelService; 
