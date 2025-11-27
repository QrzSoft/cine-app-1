import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente HolaMundo
 * Props:
 *  - nombre: texto que se mostrará (por defecto "Mundo")
 */
export default function HolaMundo({ nombre = 'HolaMundo' }) {
    return (
        <div className="hola-mundo">
            <h1>Hola, {nombre}!</h1>
        </div>
    );
}

HolaMundo.propTypes = {
    nombre: PropTypes.string,
};