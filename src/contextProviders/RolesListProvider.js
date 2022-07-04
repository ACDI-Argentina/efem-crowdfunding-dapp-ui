import React, { Component } from "react";
import PropTypes from 'prop-types';

const { Provider, Consumer } = React.createContext();
export { Consumer };

export default class RolesListProvider extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            delegates:[],
            managers:[],
            reviewers:[]
        }
    }
    
    componentDidMount(){
        //Pedir al servicio de usuarios, los usuarios que tengan un cierto rol
        
        this.setState({
            delegates:[],
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

/* 
RoleProvider.PropTypes = {
    currentUser: PropTypes.instanceOf(User).isRequired
}

JoinGivethCommunity.defaultProps = {
    currentUser: new User(), //?
  };
   */