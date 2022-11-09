import {Component} from 'react';

import "./arrowUp.scss";
import arrow from "../../resources/img/arrow.png"

class ArrowUp extends Component {
    state ={
        show: false
    }    
    
    onArrowUp = (e) => {
        if(document.documentElement.scrollTop > 1000) {
            this.setState(() => ({
                show: true
            }))
        } else {
            this.setState(() => ({
                show: false
            }))
        }
        // console.log(document.documentElement.scrollTop);
    }
   
    goUpstairs = () => {
        window.scrollTo({
            top: 100,
            behavior: 'smooth'
          });
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onArrowUp);
    }


    componentWillUnmount() {
        window.removeEventListener('scroll', this.onArrowUp);

    }

    render() {
        return (
            <div className= {`arrowUp__wrap ${this.state.show ? 'visible' : ""}`} onClick={this.goUpstairs}>
                <img src={arrow} alt="Click to go upstairs" />
            </div>
        )
    }
        
}

export default ArrowUp;