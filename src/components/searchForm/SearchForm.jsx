import { useState } from 'react';
import { Form, Field, Formik, ErrorMessage as FormikErrorMessage} from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import  useMarvelService from '../../services/MarvelService';

import ErrorMessage from '../error/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './searchForm.scss';

const setContent = (process, data) => {

    switch (process) {
        case 'waiting':
            return null;
        case 'loading':
            return <Spinner/>;
        case 'heroFound':
            return (
                <ul>
                { 
                    data.map((hero, i) => (
                        <li 
                            key={i}
                            className="char__search-wrapper">
                            <div className='char__search-success'>{`There is! Visit ${hero.name} page?`}</div> 
                            <Link to={`/characters/${hero.id}`} className='button button__secondary'>
                                <div className="inner">
                                    to page
                                </div>
                            </Link> 
                        </li>
                    ))
                }
            </ul>
            )
        case 'heroNotFound':
            return <div className="error">The character was not found. Check the name and try again</div>;
        case 'error':
            return <div style={{ marginTop: '25px'}}><ErrorMessage/></div>;
        
    }
}


// const validate = ({charName})  => {
//     const errors = {};

//     if(!charName.length) {
//         errors.charName = 'This field is required'
//     } else if (charName.length < 3) {
//         errors.charName = 'Enter more then 2 characters'
//     }
//     return errors;
// }

export const SearchForm = () => {
    const [foundHero, setFoundHero] = useState("");
    const {getCharacterByName, process, setProcess, clearError} = useMarvelService();

    const searchHero = (heroName) => {
        clearError();
        getCharacterByName(heroName)
            .then(heroObj => {
                setFoundHero(heroObj);
                heroObj.length > 0 ? setProcess('heroFound') : setProcess('heroNotFound');
            })

            // .then(() => setProcess('heroFound'))
            // .then((foundHero) => foundHero.length === 0 ? setProcess('heroNotFound'):null);
            
                
    }

    return (
        <div className='char__search'>
            <Formik
                initialValues={{ charName: '' }}
                // validate={validate}
                validationSchema={
                    Yup.object({
                        charName: Yup.string()
                                    .required('This field is required')
                                    .min(3, 'Enter more then 2 characters'),
                      })
                }
                onSubmit={({charName}) => searchHero(charName)
                }
            >
                <Form onChange={e => !e.target.value ? setProcess('waiting') : null}>
                    <label className="char__search-title" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field 
                            type="search" 
                            name="charName" 
                            placeholder="Enter name" 
                           
                            />
                        
                        <button 
                            type='submit'
                            className='button button__main'
                            disabled={process === 'loading'}>
                            <div className="inner">
                                find
                            </div>
                        </button>
                    </div>

                    <FormikErrorMessage name="charName" className='error' component='div'/>
                                         
                </Form>
            </Formik>
            {setContent(process, foundHero)}
        </div>
    )
}









// import { useState } from 'react';
// import { Form, Field, Formik, ErrorMessage as FormikErrorMessage} from 'formik';
// import { Link } from 'react-router-dom';
// import * as Yup from 'yup';
// import ErrorMessage from '../error/ErrorMessage';

// import  useMarvelService from '../../services/MarvelService';

// import './searchForm.scss';

// // const validate = ({charName})  => {
// //     const errors = {};

// //     if(!charName.length) {
// //         errors.charName = 'This field is required'
// //     } else if (charName.length < 3) {
// //         errors.charName = 'Enter more then 2 characters'
// //     }

// //     return errors;
// // }

// export const SearchForm = () => {
//     const [foundHero, setFoundHero] = useState("");
//     const {getCharacterByName, error, loading, clearError} = useMarvelService();

//     const onHeroLoaded = (heroObj) => {
//         setFoundHero(heroObj);
//     }
    
//     const searchHero = (heroName) => {
//         clearError();
//         getCharacterByName(heroName)
//             .then(onHeroLoaded)
//     }
//     const results = !foundHero ? null : foundHero.length > 0 ?
//         foundHero.map((hero, i) => (
//             <div 
//                 key={i}
//                 className="char__search-wrapper">
//                 <div className='char__search-success'>{`There is! Visit ${hero.name} page?`}</div> 
//                 <Link to={`/characters/${hero.id}`} className='button button__secondary'>
//                     <div className="inner">
//                         to page
//                     </div>
//                 </Link> 
//             </div>
//         )) :
//         <div className="error">The character was not found. Check the name and try again</div>;

//     const errorMessage = error && !(foundHero === null) ? <div style={{ marginTop: '25px'}}><ErrorMessage/></div> : null;

//     return (
//         <div className='char__search'>
//             <Formik
//                 initialValues={{ charName: '' }}
//                 // validate={validate}
//                 validationSchema={
//                     Yup.object({
//                         charName: Yup.string()
//                                     .required('This field is required')
//                                     .min(3, 'Enter more then 2 characters'),
//                       })
//                 }
//                 onSubmit={({charName}) => searchHero(charName)
//                 }
//             >
//                 <Form onChange={e => !e.target.value ? setFoundHero(null) : null}>
//                     <label className="char__search-title" htmlFor="charName">Or find a character by name:</label>
//                     <div className="char__search-wrapper">
//                         <Field 
//                             type="search" 
//                             name="charName" 
//                             placeholder="Enter name" 
//                             />
                        
//                         <button 
//                             type='submit'
//                             className='button button__main'
//                             disabled={loading}>
//                             <div className="inner">
//                                 find
//                             </div>
//                         </button>
//                     </div>

//                     <FormikErrorMessage name="charName" className='error' component='div'/>
                                         
//                 </Form>
//             </Formik>
//             {results}
//             {errorMessage}
//         </div>
//     )
// }