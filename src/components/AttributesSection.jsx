import React from 'react';
import {ATTRIBUTE_LIST} from "../consts";

const AttributesSection = ({
                               char,
                               totalAttributes,
                               calculateModifier,
                               incrementAttribute,
                               decrementAttribute,
                           }) => {
    return (
        <section className="App-section">
            <h3>Attributes (Total: {totalAttributes}/70)</h3>
            {ATTRIBUTE_LIST.map((attr) => {
                const value = char.attributes[attr];
                const modifier = calculateModifier(value);
                return (
                    <div key={attr}>
                        <strong>{attr}</strong>: {value} (Modifier: {modifier >= 0 ? '+' : ''}
                        {modifier})
                        <button onClick={() => incrementAttribute(char.id, attr)}>+</button>
                        <button onClick={() => decrementAttribute(char.id, attr)}>-</button>
                    </div>
                );
            })}
        </section>
    );
};

export default AttributesSection;
