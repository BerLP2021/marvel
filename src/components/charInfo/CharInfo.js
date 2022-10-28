import React from 'react';

import './charInfo.scss';
import thor from '../../resources/img/thor.jpeg'
import MarvelService from '../../services/MarvelService';

class CharInfo extends React.Component {
    // console.log(props.selectedCharId);
    // console.log(props.character);


    render() {
    console.log(this.props);

        const {character: {name, description, thumbnail, comics, wiki, homepage}} = this.props;

        return (
            <div className="char__info">
                <div className="char__basics">
                    <img 
                        src={thumbnail}
                        style={
                            thumbnail.indexOf('image_not_available.jpg') !== -1 
                            ? {objectFit: "fill"} 
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
                        ? comics.filter((elem, i) => {
                            if(i<10) {
                                return elem;
                            } else return;
                        })
                        .map((item, i) => {
                            return (
                                <li className="char__comics-item" key={i}>
                                    <a href={item.resourceURI+"?"+"apikey=5e71aeefead0f81920c8d6dc52f22ff5"}>{item.name}</a>
                                </li>
                            )}
                        )
                        : "Ups... There is no comics for this Hero..."
                    }
                </ul>
            </div>
        )
    }
}

export default CharInfo;