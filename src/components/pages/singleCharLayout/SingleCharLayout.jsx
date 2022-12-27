import {useNavigate } from 'react-router-dom';
import {Helmet} from "react-helmet";

import './singleCharLayout.scss';

const SingleCharLayout = ({value}) => {
    const navigate = useNavigate();

    const {thumbnail, name, description } = value;
    return (
        <>
            <Helmet>
                <meta
                name="description"
                content={`Page about ${name} hero`}
                />
                <title>{name}</title>
            </Helmet>
            <div className='single-custom'>
            <img src={thumbnail} alt={name} className="single-custom__img"/>
            <div className="single-custom__info">
                <h2 className="single-custom__name">{name}</h2>
                <p className="single-custom__descr">{description}</p>
                
            </div>
            <p 
                style={{'cursor':'pointer'}}
                onClick={() => navigate(-1)} 
                className="single-custom__back">Back to all</p>
        </div>
        </>
        
    )
}

export default SingleCharLayout;