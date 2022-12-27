import React, { useState, useEffect, useRef} from 'react';
import { Link  } from 'react-router-dom';
import PropTypes, { bool } from 'prop-types';
import { CSSTransition} from "react-transition-group";

import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMessage';
import Skeleton from "../skeleton/Skeleton";
// import AnimateAppearing from '../animateApearing/AnimateAppearing';

const CharInfo = (props) => {
    
    const [char, setChar] = useState(null);
    const [inProp, setInProp] = useState(false);
    const {loading, error, getCharacter, clearError} = useMarvelService();

    const onUpdate = (id) => {
        if(!id) return;
        setInProp(false);

        clearError();
        getCharacter(id)
            .then(onCharLoaded);
    }
    const onCharLoaded = (char) => {
        setChar(() => char);
        setInProp(true);
    }

    useEffect(() => {

        onUpdate(props.selectedChar);

    }, [props.selectedChar]);

    // console.log(inProp);

    
    const skeleton = char || loading || error ? null : <Skeleton/>;
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(error || loading || !char)
        ? <View selectedChar={char}/>
        : null;
 
    return (
        
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage} 
                <CSSTransition 
                    in={inProp}
                    classNames="char" 
                    timeout={300}
                    unmountOnExit
                    >
                        <>{content}</>
                </CSSTransition>
                
            </div>
    )
}

const View = ({selectedChar}) => {
    const {name, description, thumbnail, comics, wiki, homepage} = selectedChar;
   

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
    selectedChar: PropTypes.number.isRequired,
}

export default CharInfo;