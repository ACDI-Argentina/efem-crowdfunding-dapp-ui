import Web3App from 'lib/blockchain/Web3App';
import React, { Component } from 'react';

/**
 * Condiciona la renderización de los componentes hijos si la red
 * a la cual está conectado el usuario a través de la wallet es la correcta.
 */
class OnlyCorrectNetwork extends Component {
    render() {
        return (
            <Web3App.Consumer>
                {
                    ({
                        network
                    }) =>
                        network.isCorrect && (this.props.children)
                }
            </Web3App.Consumer>
        )
    }
}

export default OnlyCorrectNetwork;