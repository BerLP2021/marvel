import React, { useState, useEffect, useRef} from 'react';
import { Link  } from 'react-router-dom';
import PropTypes, { bool } from 'prop-types';
import { CSSTransition} from "react-transition-group";

import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/getContent';

const CharInfo = (props) => {
    
    const [char, setChar] = useState(null);
    const [inProp, setInProp] = useState(true);
    const {process, setProcess, getCharacter, clearError} = useMarvelService();

    const onUpdate = (id) => {
        if(!id) return;
        setInProp(false);

        clearError();
        getCharacter(id)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'));
    }
    
    const onCharLoaded = (char) => {
        setChar(() => char);
        setInProp(true);
    }

    useEffect(() => {

        onUpdate(props.selectedChar);

    }, [props.selectedChar]);

    // const content = setContent(process, View, char);
    return (
        
            <div className="char__info">
                {/* {skeleton}
                {spinner}
                {errorMessage} 
                 */}
                <CSSTransition 
                    in={inProp}
                    classNames="char" 
                    timeout={300}
                    unmountOnExit
                    >
                        <>{setContent(process, View, char)}</>
                </CSSTransition>
                
            </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, comics, wiki, id} = data;
   

    return (
                <div className='char'>
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
                                <a href={`/characters/${id}`} className="button button__main">
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
                                        </li>
                                    )
                                } else return;
                            })
                            : "Ups... There is no comics for this Hero..."
                        }
                    </ul>
                </div>
            
    )
}

CharInfo.propTypes = {
    selectedChar: PropTypes.number,
}

export default CharInfo;