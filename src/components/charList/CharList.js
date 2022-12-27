import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
  
    const [characters, setCharacters] = useState( []);
    const [btnLoadMoreBlocked, setBtnLoadMoreBlocked] = useState(false);
    const [offset, setOffset] = useState(210);
    const [endOfCharList, setEndOfCharList] = useState(false);

    const [newItemLoading, setnewItemLoading] = useState(false);

    
    const {loading, error, getAllCharacters, clearError} = useMarvelService();

    useEffect(()=> {
        // onLoadMore(offset);
        onLoadMore(offset, true);

    }, [])

    const onLoadMore = (offset, initial) => {
            clearError();
            // setBtnLoadMoreBlocked(true);
            initial ? setnewItemLoading(false) : setnewItemLoading(true)
            getAllCharacters(offset)
                .then(onListLoaded);
        }

    const onListLoaded = (res) => {
        setCharacters(characters => [...characters, ...res]);
        setOffset(offset => offset + res.length);
        // setBtnLoadMoreBlocked(() => false);
        setnewItemLoading(false);
        setEndOfCharList(() => res.length < 9);
    }

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


    function view(characters) {
        const elements = characters.map((character, i) => {
            return (  
                <CSSTransition timeout={500} key={character.id} classNames="char__item">
                    <li ref={el => myRefs.current[i] = el}  //Попробывать разные варианты
                        tabIndex={0}
                        className="char__item" 
                        onClick={e => {
                            props.onCharSelected(character.id);
                            onCharClick(i);
                        }}
                        onFocus={() => onCharFocus(i)}
                        onBlur={() => onCharBlur(i)}
                        onKeyDown={e => {
                                e.preventDefault();
                                if(e.key === ' ' || e.key === 'Enter') {
                                    props.onCharSelected(character.id);
                                    onCharClick(i);
                                }
                            }
                        }
                        onMouseEnter={() => onCharFocus(i)} 
                        onMouseLeave={() => onCharBlur(i)}
                        
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
                </CSSTransition>
            )}
        );
        return (
            <ul className="char__grid">
                <TransitionGroup component={null} >
                    {elements}
                </TransitionGroup>
            </ul>
            
        )
    }
    
    const items = view(characters);

    return (
        <div className="char__list">                
            {loading && characters.length == 0 ? <Spinner/> : error ? <ErrorMessage/> : null}
            {items}
            {/* {loading && !newItemLoading ? <Spinner/> : (error ? <ErrorMessage/> : <>{items}</>)} */}
            
            <button className="button button__main button__long"
                    onClick={() => onLoadMore(offset)}
                    // disabled={btnLoadMoreBlocked} 
                    disabled={newItemLoading} 
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