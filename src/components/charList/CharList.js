import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMessage';
import { useId } from "react-id-generator";

import './charList.scss';

const CharList = (props) => {
  
    
    // state = JSON.parse(localStorage.getItem('charList'))?.characters.length > 0 
    //     ? {...JSON.parse(localStorage.getItem('charList')), 
    //         characters: JSON.parse(localStorage.getItem('charList')).characters.map(item => ({
    //             ...item, idForKey: nextId()
    //         }))} 
    //     : {
    //         characters: [],
    //         loading: true,
    //         error: false,
    //         offset: 210,
    //         btnLoadMoreBlocked: false,
    //         endOfCharList: false
    //     }
    const a = JSON.parse(localStorage.getItem('charList'))?.characters.length;
    const local = JSON.parse(localStorage.getItem('charList'));
    const [characters, setCharacters] = useState(a > 0 ? local.characters : []);
    const [offset, setOffset] = useState(a > 0 ? local.offset : 210);
    const [endOfCharList, setEndOfCharList] = useState(a > 0 ? local.endOfCharList : false);
    const [btnLoadMoreBlocked, setBtnLoadMoreBlocked] = useState(a > 0 ? local.btnLoadMoreBlocked : false);
    // const [loading, setLoading] = useState(a > 0 ? local.loading : true);
    // const [error, setError] = useState(a > 0 ? local.error : false);

    const {loading, error, getAllCharacters, clearError} = useMarvelService();

    const onListLoaded = (res) => {
        // setBtnLoadMoreBlocked(true);
        setCharacters(characters => [...characters, ...res]);
                
        setOffset(offset => offset + res.length);
        setBtnLoadMoreBlocked(() => false);
        setEndOfCharList(() => res.length < 9);
    }

    const onLoadMore = (offset) => {
        clearError();
        setBtnLoadMoreBlocked(true);
        getAllCharacters(offset)
            .then(onListLoaded);
    }

    useEffect(()=> {
        if(!localStorage.getItem('charList')) 
        onLoadMore(offset);
    }, [])

    useEffect(() => {
        let timer;
       
        if(!endOfCharList) {
            timer = setTimeout(() => window.addEventListener("scroll", onScroll), 1000);
        }
       
        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", onScroll);
        };
    }, [offset]);

    useEffect(() => {
        if(endOfCharList)
            return () => {window.removeEventListener("scroll", onScroll);}
    }, [endOfCharList]);

    useEffect(() => {
        localStorage.setItem(
            'charList', 
            JSON.stringify({
                characters: characters,
                offset: offset,
                endOfCharList: endOfCharList,
                btnLoadMoreBlocked: btnLoadMoreBlocked
            })
        );
    });

    useEffect(() => {
        const clearLocalStorage = setInterval(() => localStorage.clear('charList'), 60000);
        
        return () => {
            clearTimeout(clearLocalStorage);
        }
    }, [])

    const onScroll = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            onLoadMore(offset);
        }
    }

    let myRefs = useRef([]);
    
    // // НЕ СРАБОТАЕТ!!! -> поэтому переносим код в верстку
    // setCharItemRef = elem => {
    //     myRefs.current.push(elem);
    // }

    const onCharFocus = (id) => {
        if(!myRefs.current[id].classList.contains('char__item_hovered')) 
        myRefs.current[id].classList.add('char__item_hovered');
        // console.log(e.currentTarget);
    }
    
    const onCharClick = (id) => { 
        myRefs.current.forEach(item =>  item.classList.remove('char__item_selected'));
        myRefs.current[id].classList.add('char__item_selected');
        // myRefs[id].focus(); 
    }

    const onCharBlur = (id) => {
        myRefs.current[id].classList.remove('char__item_hovered')

    }   
    const idForKey = useId(characters.length);


    const view = (characters) => {
        const elements = characters.map((character, i) => {
                return (  
                    <TransitionGroup>
                        <CSSTransition
                            timeout={200} 
                            key={idForKey[i]}
                            classNames="char__item">
                            <>
                            <li ref={el => myRefs.current[i] = el}  //Попробывать разные варианты
                                tabIndex={0}
                                className="char__item" 
                                // data-charid={character.id}
                                onFocus={() => onCharFocus(i)}
                                onBlur={() => onCharBlur(i)}
                                onKeyPress={e => {
                                        e.preventDefault();
                                        if(e.key === ' ' || e.key === 'Enter') {
                                            props.onCharSelected(character.id);
                                            onCharClick(i);
                                        }
                                    }
                                }
                                onMouseEnter={() => onCharFocus(i)} 
                                onMouseLeave={() => onCharBlur(i)}
                                onClick={e => {
                                    props.onCharSelected(character.id);
                                    onCharClick(i);
                                }}
                            >
                                <img src={character.thumbnail} 
                                    alt="abyss"
                                    style={ 
                                        character.thumbnail.indexOf('image_not_available.jpg') !== -1 || character.thumbnail.indexOf('4c002e0305708.gif') !== -1 
                                        ? {objectFit: "fill"} 
                                        : null
                                    }/>
                                <div className="char__name">{character.name}</div>
                            </li>
                            </>
                        </CSSTransition>
                    </TransitionGroup> 
                        
                        
                )
            });
        return (
            <ul className="char__grid">
                
                {elements}

            </ul>
        )
    }

        // console.log(this.state.characters); 
        
        return (
            <div className="char__list">                
                {/* <button className="button button__main button__long"
                        onClick={() => console.log(this.myRefs)}></button> */}
                {loading && characters.length == 0 ? <Spinner/> : (error ? <ErrorMessage/> : view(characters))}
                
                <button className="button button__main button__long"
                        onClick={() => onLoadMore(offset)}
                        disabled={btnLoadMoreBlocked} 
                        style={{"display": endOfCharList ? "none" : "block"}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;