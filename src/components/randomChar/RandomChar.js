import {useState, useEffect} from 'react';
import { CSSTransition } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../error/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
   
    const [char, setChar] = useState(null);
    const {loading, error, clearError, getCharacter} = useMarvelService();
    const [inProp, setInProp] = useState(false);

    const updateChar = () => {
        clearError();
        setInProp(false);
        let id = Math.floor(1011000 + Math.random() * (1011400-1011000+1));
        getCharacter(id)
            .then(res => {
                    setChar(res)
                    setInProp(true)});

    }
   
    useEffect(() => {
        updateChar();
    }, []);
    
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <div className="randomchar">
       
            {spinner}
            {errorMessage}
            <CSSTransition
                in={inProp}
                timeout={500}
                classNames='randomchar__block'>
            <>{content}</> 
            </CSSTransition>
            
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
    
                <button className="button button__main" onClick={() => updateChar()}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    return (
        <div className="randomchar__block">
            <img src={thumbnail} 
                style={
                    thumbnail.indexOf('image_not_available.jpg') !== -1 
                    ? {objectFit: "fill"} 
                    : null
                 }
                alt="Random character" 
                className="randomchar__img"
            />
            <div className="randomchar__info">
                <p className="randomchar__name">{name.length > 19 ? name.slice(0, 19) + '...' : name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;





// import {Component} from 'react';

// import MarvelService from '../../services/MarvelService';
// import Spinner from '../spinner/Spinner';
// import ErrorMessage from '../error/ErrorMessage';

// import './randomChar.scss';
// import mjolnir from '../../resources/img/mjolnir.png';

// class RandomChar extends Component {
//     constructor(props) {
//                 super(props);
//                 console.log('constructor');
//                 this.updateChar();
        
//                 // setInterval(this.updateChar, 3000);
//             }

//     state = {
//         char: {},
//         loading: true,
//         error: false
//     }

//     marvelService = new MarvelService();

//     componentDidMount() {
//         console.log('Mounted');

//     }
            
//     componentDidUpdate() {
//         console.log('"Updated" in componentDidUpdate');
//     }
    
//     componentWillUnmount() {
//         console.log('Removed');
//     }

//     onCharLoaded = (char) => {
//         this.setState({
//             char, 
//             loading: false
//         });
//         console.log('"Updated" in  updateChar//onCharLoaded');

//     }

//     onCharLoading = () => {
//         this.setState({
//             loading: true
//         })
//     }

//     onError = () => {
//         this.setState({
//             loading: false,
//             error: true
//         })
//     }

//     updateChar = () => {

//         const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
//         // this.onCharLoading();
//         this.marvelService
//             .getCharacter(id)
//             .then(this.onCharLoaded)
//             .catch(this.onError);
//     }

//     render() {
//         console.log('render');

//         const {char, loading, error} = this.state;
//         const errorMessage = error ? <ErrorMessage/> : null;
//         const spinner = loading ? <Spinner/> : null;
//         const content = !(loading || error) ? <View char={char}/> : null;

//         return (
//             <div className="randomchar">
//                 {errorMessage}
//                 {spinner}
//                 {content}
//                 <div className="randomchar__static">
//                     <p className="randomchar__title">
//                         Random character for today!<br/>
//                         Do you want to get to know him better?
//                     </p>
//                     <p className="randomchar__title">
//                         Or choose another one
//                     </p>
//                     <button onClick={this.updateChar} className="button button__main">
//                         <div className="inner">try it</div>
//                     </button>
//                     <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
//                 </div>
//             </div>
//         )
//     }
// }

// const View = ({char}) => {
//     const {name, description, thumbnail, homepage, wiki} = char;
//     let imgStyle = {'objectFit' : 'cover'};
//     if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
//         imgStyle = {'objectFit' : 'contain'};
//     }

//     return (
//         <div className="randomchar__block">
//             <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
//             <div className="randomchar__info">
//                 <p className="randomchar__name">{name}</p>
//                 <p className="randomchar__descr">
//                     {description}
//                 </p>
//                 <div className="randomchar__btns">
//                     <a href={homepage} className="button button__main">
//                         <div className="inner">homepage</div>
//                     </a>
//                     <a href={wiki} className="button button__secondary">
//                         <div className="inner">Wiki</div>
//                     </a>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default RandomChar;