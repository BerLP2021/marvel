import React from 'react';

import './charInfo.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMessage';

class CharInfo extends React.Component {
    
    state = {
        char: null,
        error: false,
        loading: true
    }

    marvelService = new MarvelService();

    onUpdate = (id) => {
        // const {selectedChar} = this.props;
        // if(!selectedChar) return;
        this.onCharLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onCharLoaded = (res) => {
        this.setState(() => ({
            char: res,
            loading: false
        }))
    }

    onCharLoading = () => {
        this.setState ({
            loading: true,
            error: false
        })
    }

    onError = (res) => {
        this.setState({
            error: true,
            loading: false
        })
    }

    componentDidMount() {
        this.onUpdate(this.props.selectedChar);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.selectedChar !== this.props.selectedChar) {
            this.onUpdate(this.props.selectedChar);
        }
    }

    render() {
        const {error, loading} = this.state
        
        return (
            <div className="char__info">
                {loading ? <Spinner/> : (error ? <ErrorMessage/> : <View selectedChar={this.state.char}/>)}
            </div>
        )
    }
}

const View = (char) => {
    const {name, description, thumbnail, comics, wiki, homepage} = char.selectedChar;
    return (
        <>
            <div className="char__basics">
                <img 
                    src={thumbnail}
                    style={
                        thumbnail.indexOf('image_not_available.jpg') !== -1 
                        ? {"objectFit": "fill"} 
                        : null
                    } 
                    alt={name}
                />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length !== 0
                    ? comics.map((item, i) => {
                        if(i < 10) {
                            return (
                                <li className="char__comics-item" key={i}>
                                    <a href={item.resourceURI+"?"+"apikey=5e71aeefead0f81920c8d6dc52f22ff5"}>{item.name}</a>
                                </li>
                            )
                        } else return;
                    })
                    : "Ups... There is no comics for this Hero..."
                }
            </ul>
        </>
    )
}

export default CharInfo;