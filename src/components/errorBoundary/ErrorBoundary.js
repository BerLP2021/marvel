import { Component } from "react";
import ErrorMessage from "../error/ErrorMessage";

export default class ErrorBoundary extends Component {
    state = {
        error: false
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    // static getDerivedStateFromError(err) {
    //     return {error: true}
    // }

    render() {
        if(this.state.error) {
            return <ErrorMessage/>
        } else 
            return this.props.children;
    }
}