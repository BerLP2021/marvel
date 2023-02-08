import { useEffect, useState, useRef, useMemo} from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';

import setContentList from '../../utils/getContentList';
import './charList.scss';



const CharList = (props) => {
  
    const [characters, setCharacters] = useState( []);
    const [offset, setOffset] = useState(210);
    const [endOfCharList, setEndOfCharList] = useState(false);

    const [newItemLoading, setnewItemLoading] = useState(false);

    const {process, setProcess, getAllCharacters, clearError} = useMarvelService();

    useEffect(()=> {
        // onLoadMore(offset);
        onLoadMore(offset, true);
    // eslint-disable-next-line
    }, [])

    const onLoadMore = (offset, initial) => {
            clearError();
            initial ? setnewItemLoading(false) : setnewItemLoading(true)
            getAllCharacters(offset)
                .then(onListLoaded)
                .then(() => setProcess('confirmed'));
        }

    const onListLoaded = (res) => {
        setCharacters(characters => [...characters, ...res]);
        setOffset(offset => offset + res.length);
        setnewItemLoading(false);
        setEndOfCharList(() => res.length < 9);
    }

    useEffect(() => {
   
        if(!endOfCharList) {
            window.addEventListener("scroll", onScroll);
        }
       
        return () => {
           
            window.removeEventListener("scroll", onScroll);
        }
        // eslint-disable-next-line
    }, [offset]);
    
    const onScroll = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            onLoadMore(offset);
        }
    }

    useEffect(() => {
        if(endOfCharList)
            return () => {window.removeEventListener("scroll", onScroll);}
        // eslint-disable-next-line
    }, [endOfCharList]);


    // const onScroll = () => {
    //     if (window.pageYOffset + window.innerHeight >= document.body.offsetHeight  && window.pageYOffset > 0) {
    //         onLoadMore(offset);
    //     }
    // }

    let myRefs = useRef([]);
    
    // // НЕ СРАБОТАЕТ!!! -> поэтому переносим код в верстку
    // setCharItemRef = elem => {
    //     myRefs.current.push(elem);
    // }

    const onCharFocus = (id) => {
        if(!myRefs.current[id].classList.contains('char__item_hovered')) 
        myRefs.current[id].classList.add('char__item_hovered');
    }
    
    const onCharClick = (id) => { 
        myRefs.current.forEach(item =>  item.classList.remove('char__item_selected'));
        myRefs.current[id].classList.add('char__item_selected');
        // myRefs[id].focus(); 
    }

    const onCharBlur = (id) => {
        myRefs.current[id].classList.remove('char__item_hovered')

    }   


    const view = (characters) =>  {

        const elements = characters.map((character, i) => {
            return (  
                <CSSTransition timeout={500} key={character.id} classNames="char__item">
                    <li ref={el => myRefs.current[i] = el}
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
            <TransitionGroup  className="char__grid" component={'ul'} >
                {elements}
            </TransitionGroup>
            
        )
    }
    
    const content = useMemo(() => {
        return setContentList(process, () => view(characters), newItemLoading)
        // eslint-disable-next-line
    }, [process]);
    
    return (
        <div className="char__list">                
            
            {content}

            <button className="button button__main button__long"
                    onClick={() => onLoadMore(offset)}
                    // disabled={btnLoadMoreBlocked} 
                    disabled={newItemLoading} 
                    style={{"display": endOfCharList || (process === 'loading' && !newItemLoading) ? "none" : "block"}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;