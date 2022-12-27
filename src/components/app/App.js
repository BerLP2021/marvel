import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Suspense } from 'react';

import AppHeader from "../appHeader/AppHeader";
import MainPage from '../pages/MainPage';
import SingleCustomPage from '../pages/SingleCustomPage';


import "./app.scss";
import ArrowUp from "../arrowUp/ArrowUp";
import vision from "../../resources/img/vision.png";
import Spinner from "../spinner/Spinner";

const ComicsPage = React.lazy(() => import('../pages/ComicsPage'));
const Page404 = React.lazy(() => import('../pages/Page404'));
const SingleComicPage = React.lazy(() => import('../pages/singleComicLayout/SingleComicLayout'));
const SingleCharLayout = React.lazy(() => import('../pages/singleCharLayout/SingleCharLayout'));


const App =  () => {
  
  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main>
          <Suspense fallback={<Spinner/>}>
            <Routes>
              <Route path="/" element={<MainPage/>}/>
              <Route path="/comics" element={<ComicsPage/>}/>
              <Route path='/comics/:id' element={<SingleCustomPage Component={SingleComicPage}/>}/>
              <Route path='/characters/:id' element={<SingleCustomPage Component={SingleCharLayout}/>}/>
              
              <Route path="*" element={<Page404/>}/>
            </Routes>
          </Suspense>
          <img className="bg-decoration" src={vision} alt="vision" />
          <ArrowUp/>
        </main>
      </div>
    </Router>
  );
}

export default App;
