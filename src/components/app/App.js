import "./app.scss";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import Skeleton from "../skeleton/Skeleton";
import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";
import SingleComics from "../singleComics/SingleComics";

import vision from "../../resources/img/vision.png";
import { Component } from "react";

class App extends Component {
  state = {
    selectedChar: null,
    character: {}
  };

  onCharSelected = (id, char) => {
    this.setState({
      selectedChar: id, 
      character: char
    })
  }

  render() {
    return (
      <div className="app">
        <AppHeader />
        <main>
        <RandomChar />
          {/* <AppBanner/> */}
          <div className="char__content">
            <CharList onCharSelected={this.onCharSelected}/>
            {/* <CharInfo {...this.state}/> */}
            {this.state.selectedChar ===  null ? <Skeleton/> : <CharInfo {...this.state}/>}
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
