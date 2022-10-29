import { Component } from "react";

import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import Skeleton from "../skeleton/Skeleton";
import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";
import SingleComics from "../singleComics/SingleComics";
import ErrorBoundary from '../errorBoundary/ErrorBoundary'

import vision from "../../resources/img/vision.png";
import "./app.scss";

class App extends Component {

  state = {
    selectedChar: null,
  };

  onCharSelected = (id, char) => {
    this.setState({
      selectedChar: id, 
    })
  }

  render() {
    return (
      <div className="app">
        <AppHeader />
        <main>
          <ErrorBoundary>
            <RandomChar />
          </ErrorBoundary>
          {/* <AppBanner/> */}
          <div className="char__content">
            <ErrorBoundary>
              <CharList onCharSelected={this.onCharSelected}/>
            </ErrorBoundary>
            {
              this.state.selectedChar !==  null 
                ? <ErrorBoundary>
                    <CharInfo selectedChar={this.state.selectedChar}/>
                  </ErrorBoundary> 
                : <Skeleton/>}
          </div>
          {/* <ComicsList/> */}
          {/* <SingleComics/>  */}
          <img className="bg-decoration" src={vision} alt="vision" />
        </main>
      </div>
    );
  }
}

export default App;
