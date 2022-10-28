import {Component} from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMessage';
import nextId from "react-id-generator";

import './charList.scss';

class CharList extends Component {
    constructor(props) {
        super(props);
    }
    // keyId = nextId;
    
    state = {
        characters: [],
        loading: true,
        error: false
    }
    marvelService = new MarvelService();

    onListLoaded = (res) => {
        this.setState({
            characters: res.map((char) => ({
                ...char,
                idForKey: nextId()
            })),
            loading: false,
            error: false
        });
    }

    onError = () =>{
        this.setState({
            loading: false,
            error: true
        });
    }

    updateCharList = async () => {
        if(this.state.characters.length === 0) {
            await this.marvelService
                .getSomeCharacters(9)
                .then(this.onListLoaded)
                .catch(this.onError);
             
        } else {
            // return await this.marvelService.getAllCharacters().then(res => {
            //     this.setState((res) => ({characters: [...this.state.characters, ...res]}))
            // })
        }
        // console.log(this.state);
    }

    componentDidMount() {
        this.updateCharList();

    }
   
    view = (characters) => {
        const elements = characters.map((character) => {
            // console.log(character);
            return (
                <li className="char__item" key={character.idForKey} 
                    data-charid={character.id} 
                    onClick={(e) => {
                        // console.log(e.currentTarget.getAttribute('data-charid')); 
                        this.props.onCharSelected(
                            e.currentTarget.getAttribute('data-charid'), 
                            character);
                    }}
                    >
                    <img src={character.thumbnail} 
                        alt="abyss"
                        style={ 
                            character.thumbnail.indexOf('image_not_available.jpg') !== -1 
                            ? {objectFit: "fill"} 
                            : null
                        }/>
                    <div className="char__name">{character.name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">
                {elements}
            </ul>
        )
    }

    render() {
        const {characters, loading, error} = this.state;

        // console.log(this.state.characters); 
        
        return (
            <div className="char__list">
                
                {loading ? <Spinner/> : (error ? <ErrorMessage/> : this.view(characters))}
                
                <button className="button button__main button__long" onClick={this.updateCharList}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;