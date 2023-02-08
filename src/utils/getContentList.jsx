import React, {useState} from 'react';

import Spinner from '../components/spinner/Spinner';
import ErrorMessage from '../components/error/ErrorMessage';

const setContentList = (process, Component, blockBtn) => {

    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return blockBtn ? <Component/> : <Spinner/>;
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage/>;
    }
}

export default setContentList;