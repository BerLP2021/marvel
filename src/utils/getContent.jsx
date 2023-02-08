import React, {useState} from 'react';

import Spinner from '../components/spinner/Spinner';
import ErrorMessage from '../components/error/ErrorMessage';
import Skeleton from '../components/skeleton/Skeleton';

const Page404 = React.lazy(() => import('../components/pages/Page404'));


const getContent = (process, Component, data, erPage) => {

    switch (process) {
        case 'waiting':
            return <Skeleton/>;
        case 'loading':
            return <Spinner/>;
        case 'confirmed':
            return <Component data={data}/>;
        case 'error':
            return erPage ? <Page404/> : <ErrorMessage/>;
        
    }
}

export default getContent;