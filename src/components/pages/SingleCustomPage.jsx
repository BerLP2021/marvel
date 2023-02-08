import { useParams, Link, useNavigate, useLocation} from 'react-router-dom';
import {useState, useEffect, lazy} from 'react';

import { CSSTransition } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import AppBanner from '../appBanner/AppBanner';
import getContent from '../../utils/getContent';

const SingleCustomPage = ({Component}) => {

    const {id} = useParams();
   
    const href = useLocation();
    const path = JSON.stringify(href.pathname).split('/')[1];

    const [value, setValue] = useState(null);
    const [inProp, setInProp] = useState(false);
    const {process, setProcess, getComic, getCharacter, clearError} = useMarvelService();
   
    const onDataUpdate = (id) => {
        clearError();
        if(path == 'characters') getCharacter(id)
                                    .then(onDataLoaded)
                                    .then(() => setProcess('confirmed'));
        else if(path == 'comics') getComic(id)
                                    .then(onDataLoaded)
                                    .then(() => setProcess('confirmed'));
    };

    const onDataLoaded = (res) => {
        setValue(() => res);
        setInProp(true);
    };

    useEffect(() => {
        setInProp(false);
        onDataUpdate(id);
    }, [id]);

    return (
        <>
            <AppBanner/>
            <CSSTransition 
                in={inProp}
                classNames="single-custom" 
                timeout={300}
                >
                    <>
                        {getContent(process, Component, value, true)}
                    </>
            </CSSTransition>
        </>
    )
}

export default SingleCustomPage;