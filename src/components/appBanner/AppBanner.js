import './appBanner.scss';
import avengers from '../../resources/img/Avengers.png';
import avengers_logo from '../../resources/img/Avengers_logo.png';


const AppBanner = () => {
    return (
        <div className="app__banner">
            <img src={avengers} alt="Avengers"/>
            <div className="app__banner-text">
                New comics every week!<br/>
                Stay tuned!
            </div>
            <img src={avengers_logo} alt="Avengers logo"/>
        </div>
    )
}

export default AppBanner;