import {useEffect, useState} from 'react';

import styled from "styled-components";

const LoadOnScroll = (props) => {

    useEffect(() => {
        let timer;
        
        if(!props.endOfCharList) {
            timer = setTimeout(() => window.addEventListener("scroll", onScroll), 1000);
        }
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", onScroll);
        };
    }, [props.offset]);

    useEffect(() => {
        if(props.endOfCharList)
            return () => {window.removeEventListener("scroll", onScroll);}
    }, [props.endOfCharList]);

    const onScroll = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            props.onLoadMore(props.offset);
        }
    }

    return (
        <>
            {props.children}
        </>
    )
}

export default LoadOnScroll;