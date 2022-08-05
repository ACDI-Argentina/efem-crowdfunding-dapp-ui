import React, { Component } from "react";

const { Provider, Consumer } = React.createContext();
export { Consumer };

export default class RolesListProvider extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            managers:[],
            reviewers:[]
        }
    }
    
    componentDidMount(){
        //Pedir al servicio de usuarios, los usuarios que tengan un cierto rol
        
        this.setState({
            managers:[],
            reviewers:[]
        });
    }

    render(){//Podemos exponer funciones y no andar haciendo requests a cada rato
        return(
            <Provider value={{...this.state}}> 
                {this.props.children}
            </Provider>
        );
    }
}