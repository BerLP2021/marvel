import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMessage';

import './comicsList.scss';


const ComicsList = () => {

    const {loading, error, clearError, getAllComics} = useMarvelService();
    const [comics, setComics] = useState([]);
    const [offset, setOffset] = useState(0);
    const [btnLoadMoreBlocked, setBtnLoadMoreBlocked] = useState(false);
    const [comicsEnd, setComicsEnd] = useState(false);
   
    const onComicsLoaded =  (res) => {
        setComics(comics => [...comics, ...res]);
        setOffset(offset => offset + 8);
        setComicsEnd(() => res.length < 8);
        setBtnLoadMoreBlocked(false);
    }

    const updateComics = (offset, startSpinner) => {
        clearError();
        // startSpinner ? setComicsEnd(true) : setComicsEnd(false);
        setBtnLoadMoreBlocked(!startSpinner);
        setComicsEnd(startSpinner);
        getAllComics(offset).then(res => onComicsLoaded(res));
    }

    useEffect(() => {
        updateComics(offset, true);
    }, []);

    const comicsRef = useRef([]);

    const onComicsFocus = (id) => {
        if(!comicsRef.current[id].classList.contains('comics__item_focused')) 
        comicsRef.current[id].classList.add('comics__item_focused');
        // console.log(e.currentTarget);
    }

    const onComicsBlur = (id) => {
        comicsRef.current[id].classList.remove('comics__item_focused')
    } 

    const view = (comics) => {
        const items = comics.map((item, i) => {
            const {id, url, urlSrc, title, price} = item;
            return (
                <li 
                    className="comics__item" 
                    key={i}
                    ref={el => comicsRef.current[i] = el}
                    tabIndex={0}
                    onFocus={() => onComicsFocus(i)}
                    onBlur={() => onComicsBlur(i)}
                    
                    >
                    <Link to={`/comics/${item.id}`} tabIndex={-1}>
                        <img src={urlSrc} alt={title} className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </Link>
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        );
    }

    return (
        <div className="comics__list">
                {loading && !btnLoadMoreBlocked ? <Spinner/> : (error ? <ErrorMessage/> : view(comics))}
            <button className="button button__main button__long"
                    onClick={() => 
                        updateComics(offset)}
                    disabled={btnLoadMoreBlocked}
                    style={{display: comicsEnd ? 'none' : 'block'}} 
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;