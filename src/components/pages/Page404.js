import { Link, useNavigate } from 'react-router-dom'; 
import ErrorMessage from '../error/ErrorMessage';

const Page404 = () => {
    const navigate = useNavigate();
    
    return (
        <div>
            <ErrorMessage/>
            <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize':'24px'}}>This page doesn't exist</p>
            <Link style={
                    {'display':'block', 
                    'margin':'40px auto 0', 
                    'textAlign':'center',
                    'fontWeight':'bold', 
                    'fontSize': '18px', 
                    'width': '200px'}} 
                    to='/'
                    onMouseOver={(e) => e.target.style.color = '#9F0013'}
                    onMouseOut={(e) => e.target.style.color = 'inherit'}>Go to the main page</Link>
            <p style={
                    {'display':'block', 
                    'textAlign':'center',
                    'margin':'15px auto', 
                    'fontWeight':'bold', 
                    'fontSize': '18px', 
                    'cursor': 'pointer',
                    'width': '200px'}}
                onMouseOver={(e) => e.target.style.color = '#9F0013'}
                onMouseOut={(e) => e.target.style.color = 'inherit'}

                onClick={() => navigate(-1)}
            >Go to the previous page</p>        
        </div>
    )
}

export default Page404;
