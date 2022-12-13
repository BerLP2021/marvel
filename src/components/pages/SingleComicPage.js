import { useParams, Link, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMessage';
import AppBanner from '../appBanner/AppBanner';

import './singleComicPage.scss';
import Page404 from './Page404';
// import xmen from '../../resources/img/x-men.png';


const SingleComicPage = () => {
    const {comicId} = useParams();
    const [comic, setComic] = useState(null);
    const {loading, error, getComic, clearError} = useMarvelService();


    const onComicsUpdate = (id) => {
        clearError();
        getComic(id)
            .then(res => setComic(() => res));
    }
    
    useEffect(() => {
        onComicsUpdate(comicId);
    }, [comicId]);

    return (
        <>
            <AppBanner/>
            {loading 
                ? <Spinner/> 
                : (error ? <Page404/>: comic 
                                        ? <View comic={comic}/> 
                                        : null
                    )
            }
        </>
    )
}

const View = ({comic}) => {
    const navigate = useNavigate();

    const {urlSrc, title, description, price, pageCount, language} = comic;
    // console.log(comic);
    return (
        <div className="single-comic">
            <img src={urlSrc} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <p 
                style={{'cursor':'pointer'}}
                onClick={() => navigate(-1)} 

                className="single-comic__back">Back to all</p>
        </div>
    )
}

export default SingleComicPage;