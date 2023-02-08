import {useState, useEffect} from 'react';

import "./arrowUp.scss";
import arrow from "../../resources/img/arrow.png"

const ArrowUp = () => {
    const [show, setShow] = useState(false);

    const onArrowUp = (e) => {
        document.documentElement.scrollTop > 1000 ? setShow(true) : setShow(false);
        // console.log(document.documentElement.scrollTop);
    }
   
    const goUpstairs = () => {
        window.scrollTo({
            top: 100,
            behavior: 'smooth'
          });
    }
    useEffect(() => {
        window.addEventListener('scroll', onArrowUp);
        return () => {
            window.removeEventListener('scroll', onArrowUp);
        }
    }, []);

    return (
        <div className= {`arrowUp__wrap ${show ? 'visible' : ""}`} onClick={goUpstairs}>
            <img src={arrow} alt="Click to go upstairs" />
        </div>
    )
        
}

export default ArrowUp;