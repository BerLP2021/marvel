import { useState, useEffect, useRef, useMemo} from 'react';
import { Link } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import setContentList from '../../utils/getContentList';
import './comicsList.scss';


const ComicsList = () => {

    const {process, setProcess, clearError, getAllComics} = useMarvelService();
    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setnewItemLoading] = useState(false);
    const [comicsEnd, setComicsEnd] = useState(false);
   
    const onComicsLoaded =  (res) => {
        setComics(comics => [...comics, ...res]);
        setOffset(offset => offset + 8);
        setComicsEnd(() => res.length < 8);
        setnewItemLoading(false);
    }

    const updateComics = (offset, startSpinner) => {
        clearError();
        startSpinner ? setnewItemLoading(false) : setnewItemLoading(true);
        getAllComics(offset)
            .then(res => onComicsLoaded(res))
            .then(() => setProcess('confirmed'));
    }

    useEffect(() => {
        updateComics(offset, true);
    }, []);

    
    useEffect(() => {
   
        if(!comicsEnd) {
            window.addEventListener("scroll", onScroll);
        }
       
        return () => {
           
            window.removeEventListener("scroll", onScroll);
        }
        // eslint-disable-next-line
    }, [offset]);
    
    const onScroll = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            updateComics(offset);
        }
    }

    useEffect(() => {
        if(comicsEnd)
            return () => {window.removeEventListener("scroll", onScroll);}
        // eslint-disable-next-line
    }, [comicsEnd]);


    const comicsRef = useRef([]);

    const onComicsFocus = (id) => {
        if(!comicsRef.current[id].classList.contains('comics__item_focused')) 
        comicsRef.current[id].classList.add('comics__item_focused');
    }

    const onComicsBlur = (id) => {
        comicsRef.current[id].classList.remove('comics__item_focused')
    } 

    const view = (comics) => {
        const items = comics.map(({id, thumbnail, name, price}, i) => {
            return (
                <CSSTransition
                key={i}
                classNames="comics__item"
                timeout={700}>
                    <li 
                        className="comics__item" 
                        ref={el => comicsRef.current[i] = el}
                        tabIndex={0}
                        onFocus={() => onComicsFocus(i)}
                        onBlur={() => onComicsBlur(i)}
                    >
                        <Link to={`/comics/${id}`} tabIndex={-1}>
                            <img src={thumbnail} alt={name} className="comics__item-img"/>
                            <div className="comics__item-name">{name}</div>
                            <div className="comics__item-price">{price}</div>
                        </Link>
                    </li>
            </CSSTransition>
            )
        }
            
        )
        return (
            <TransitionGroup className="comics__grid" component={'ul'}>
                {items}
            </TransitionGroup>
        );
    }

    const comicItems = useMemo(() => setContentList(process, () => view(comics), newItemLoading), [process]);

    return (
        <div className="comics__list">
            {/* {setContentList(process, () => view(comics), newItemLoading)}       */}
            {comicItems}
            <button className="button button__main button__long"
                    onClick={() => 
                        updateComics(offset)}
                    disabled={newItemLoading}
                    style={{display: comicsEnd || (process === 'loading' && !newItemLoading) ? 'none' : 'block'}} 
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;