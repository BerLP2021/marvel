import { useParams, Link, useNavigate, useLocation} from 'react-router-dom';
import {useState, useEffect, lazy} from 'react';

import { CSSTransition } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import AppBanner from '../appBanner/AppBanner';

const Page404 = lazy(() => import('../pages/Page404'));

const SingleCustomPage = ({Component}) => {

    const {id} = useParams();
   
    const href = useLocation();
    const path = JSON.stringify(href.pathname).split('/')[1];

    const [value, setValue] = useState(null);
    const [inProp, setInProp] = useState(false);
    const {loading, error, getComic, getCharacter, clearError} = useMarvelService();
   
    const onDataUpdate = (id) => {
        clearError();
        if(path == 'characters') getCharacter(id).then(onDataLoaded);
            else if(path == 'comics') getComic(id).then(onDataLoaded);
    };

    const onDataLoaded = (res) => {
        setValue(() => res);
        setInProp(true);
    };

    useEffect(() => {
        setInProp(false);
        onDataUpdate(id);
    }, [id]);

    const spinner = loading ? <Spinner/> : null;
    const errorMsg = error ? <Page404/> : null;
    const content = !(loading || error || !value) 
                    ? <Component value={value} />
                    : null;
    return (
        <>
            <AppBanner/>
            {spinner}
            {errorMsg}
            <CSSTransition 
                in={inProp}
                classNames="single-custom" 
                timeout={300}
                >
                    <>
                        {content}
                    </>
            </CSSTransition>
        </>
    )
}

export default SingleCustomPage;