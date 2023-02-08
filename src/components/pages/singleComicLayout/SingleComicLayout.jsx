import {useNavigate} from 'react-router-dom';
import {Helmet} from "react-helmet";

import './singleComicLayout.scss';

const SingleComicPage = ({data}) => {
    const navigate = useNavigate();

    const {thumbnail, name, description, price, pageCount, language} = data;
    // console.log(comic);
    return (
        <>
            <Helmet>
                <meta
                name="description"
                content={`Page about ${name} comic`}
                />
                <title>{name}</title>
            </Helmet>
            <div className='single-comic'>
                <img src={thumbnail} alt={name} className="single-comic__img"/>
                <div className="single-comic__info">
                    <h2 className="single-comic__name">{name}</h2>
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
        </>
    )
}

export default SingleComicPage;