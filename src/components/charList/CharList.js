import {Component} from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMessage';
import nextId from "react-id-generator";

import './charList.scss';

class CharList extends Component {
    constructor(props) {
        super(props);
    }
    // keyId = nextId;
    
    state = JSON.parse(localStorage.getItem('charList'))?.characters.length > 0 
        ? {...JSON.parse(localStorage.getItem('charList')), 
            characters: JSON.parse(localStorage.getItem('charList')).characters.map(item => ({
                ...item, idForKey: nextId()
            }))} 
        : {
            characters: [],
            loading: true,
            error: false,
            offset: 210,
            btnLoadMoreBlocked: false,
            endOfCharList: false,
            charSelected: {}
        }

    marvelService = new MarvelService();

    onListLoaded = (res) => {
        // if(res.length <9) {
        //     this.setState({
        //         endOfCharList: true
        //     })
        // }
        this.onAddonsLoading();
        this.setState(() => (
            {
                characters: [...this.state.characters, ...res.map((char) => ({
                    ...char,
                    idForKey: nextId()
                }))],
                loading: false,
                error: false,
                offset: this.state.offset + res.length,
                btnLoadMoreBlocked: false,
                endOfCharList: res.length <9
            }
        ));

    }

    onAddonsLoading = () => {
        this.setState({
            btnLoadMoreBlocked: true
        })
    }

    onError = () =>{
        this.setState({
            loading: false,
            error: true
        });
    }

    componentDidMount() {
        if(!localStorage.getItem('charList')) 
            this.onLoadMore(this.state.offset);
        
        this.timer = setTimeout(() => window.addEventListener("scroll", this.onScroll), 1000);

        if(this.state.endOfCharList)
            window.removeEventListener("scroll", this.onScroll);
    }
    
    onScroll = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            this.onLoadMore(this.state.offset);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
        clearTimeout(this.clearLocalStorage);
        window.removeEventListener("scroll", this.onScroll);

    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevState !== this.state) {
            localStorage.setItem('charList', JSON.stringify(this.state));
        }
        if(this.state.endOfCharList)
            window.removeEventListener("scroll", this.onScroll)

            this.clearLocalStorage = setInterval(() => localStorage.clear('charList'), 60000);

    }

    onLoadMore = (offset) => {
        this.onAddonsLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onListLoaded)
            .catch(this.onError);
    }

    myRefs = [];

    setCharItemRef = elem => {
        this.myRefs.push(elem);

    }

    onCharFocus = (id) => {
        if(!this.myRefs[id].classList.contains('char__item_hovered')) 
        this.myRefs[id].classList.add('char__item_hovered')
        // console.log(e.currentTarget);
    }
    
    onCharClick = (id) => { 
        this.myRefs.forEach(item =>  item.classList.remove('char__item_selected'));
        this.myRefs[id].classList.add('char__item_selected');
        // this.myRefs[id].focus(); 
    }

    onCharBlur = (id) => {
        this.myRefs[id].classList.remove('char__item_hovered')

    }   

    view = (characters) => {

        const elements = characters.map((character, i) => {
            // console.log(character);
            return (
                <li ref={this.setCharItemRef} 
                    tabIndex={0}
                    className="char__item" 
                    key={character.idForKey} 
                    data-charid={character.id}
                    onFocus={()=>this.onCharFocus(i)}
                    onBlur={() => this.onCharBlur(i)}
                    onKeyPress={e =>{
                            e.preventDefault();
                            if(e.key === ' ' || e.key === 'Enter') {
                                this.props.onCharSelected(character.id);
                                this.onCharClick(i);
                            }
                        }
                    }
                    onMouseEnter={()=>this.onCharFocus(i)} 
                    onMouseLeave={()=>this.onCharBlur(i)}
                    onClick={(e) => {
                        this.props.onCharSelected(character.id);
                        this.onCharClick(i);
                    }}
                >
                    <img src={character.thumbnail} 
                        alt="abyss"
                        style={ 
                            character.thumbnail.indexOf('image_not_available.jpg') !== -1 || character.thumbnail.indexOf('4c002e0305708.gif') !== -1 
                            ? {objectFit: "fill"} 
                            : null
                        }/>
                    <div className="char__name">{character.name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">
                {elements}
            </ul>
        )
    }

    render() {
        const {characters, loading, error} = this.state;

        // console.log(this.state.characters); 
        
        return (
            <div className="char__list">                
                {/* <button className="button button__main button__long"
                        onClick={() => console.log(this.myRefs)}></button> */}
                {loading ? <Spinner/> : (error ? <ErrorMessage/> : this.view(characters))}
                
                <button className="button button__main button__long"
                        onClick={() => this.onLoadMore(this.state.offset)}
                        // disabled={this.state.btnLoadMoreBlocked} 
                        style={{"display": this.state.endOfCharList ? "none" : "block"}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;