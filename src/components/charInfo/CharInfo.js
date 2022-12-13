import React, { useState, useEffect} from 'react';
import { Link  } from 'react-router-dom';
import PropTypes from 'prop-types';

import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMessage';

const CharInfo = (props) => {
    
    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, clearError} = useMarvelService();

    const onUpdate = (id) => {
        // const {selectedChar} = this.props;
        // if(!selectedChar) return;
        clearError();
        getCharacter(id)
            .then(res => setChar(() => res));
    }
    
    useEffect(() => {
        onUpdate(props.selectedChar);
    }, []);

    useEffect(() => {
        onUpdate(props.selectedChar);
    }, [props.selectedChar]);
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
                                        <Link to={`/comics/${item.resourceURI.split('/').slice(-1)}`}>{item.name}</Link>
                                        {/* // <a href={item.resourceURI+"?"+"apikey=5e71aeefead0f81920c8d6dc52f22ff5"}>{item.name}</a> */}
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
    return (
        <div className="char__info">
            {loading ? <Spinner/> : (error ? <ErrorMessage/> : char ? <View selectedChar={char}/> : null)}
        </div>
    )
}



CharInfo.propTypes = {
    selectedChar: PropTypes.number.isRequired,
}

export default CharInfo;