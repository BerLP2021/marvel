import { useState } from "react";

import {Helmet} from "react-helmet";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import Skeleton from "../skeleton/Skeleton";
import ErrorBoundary from '../errorBoundary/ErrorBoundary'
import AnimateAppearing from '../animateApearing/AnimateAppearing';
import { SearchForm } from '../searchForm/SearchForm';

const MainPage = () => {

    const [selectedChar, setSelectedChar] = useState(null);

    const onCharSelected = (id) => {
        setSelectedChar(id);

    }
    return (
      <>
      <Helmet>
        <meta
          name="description"
          content="This web site is a Marvel information portal"
        />
        <title>Marvel portal</title>
      </Helmet>
        <ErrorBoundary>
          <RandomChar />
        </ErrorBoundary>
        <div className="char__content">
          <ErrorBoundary>
            <CharList onCharSelected={onCharSelected}/>
          </ErrorBoundary>
          <div className="char__sidebar">
            <ErrorBoundary> 
              <SearchForm />
            </ErrorBoundary>
            <ErrorBoundary> 
              <CharInfo selectedChar={selectedChar}/>
            </ErrorBoundary>
          </div>
        </div>
      </>
    )
}

export default MainPage;