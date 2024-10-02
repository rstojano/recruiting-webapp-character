import React from 'react';
import {CLASS_LIST} from '../consts';

const ClassesSection = ({char, setCharacters}) => {

    // Function to check if character meets class requirements
    const meetsClassRequirements = (char, className) => {
        const classMinimums = CLASS_LIST[className];
        return Object.entries(classMinimums).every(
            ([attr, min]) => char.attributes[attr] >= min
        );
    };

    return (
        <section className="App-section">
            <h3>Classes</h3>
            {Object.keys(CLASS_LIST).map((className) => {
                const meetsRequirements = meetsClassRequirements(char, className);
                const isSelected = char.selectedClass && char.selectedClass.name === className;

                return (
                    <div
                        key={className}
                        style={{
                            padding: '10px',
                            margin: '5px',
                            backgroundColor: meetsRequirements ? 'lightgreen' : 'lightcoral',
                            cursor: 'pointer',
                            border: isSelected ? '2px solid blue' : 'none',
                        }}
                        onClick={() =>
                            setCharacters((prevChars) =>
                                prevChars.map((c) => {
                                    if (c.id === char.id) {
                                        console.log("Selected class: ", className);
                                        // Store only the class name
                                        return {
                                            ...c, selectedClass: {
                                                name: className
                                            }
                                        };
                                    }
                                    return c;
                                })
                            )
                        }
                    >
                        {className}
                    </div>
                );
            })}
            {/* Display selected class minimums */}
            {char.selectedClass && (
                <div>
                    <h4>{char.selectedClass.name} Minimum Requirements:</h4>
                    {Object.entries(CLASS_LIST[char.selectedClass.name]).map(([attr, min]) => (
                        <div key={attr}>
                            {attr}: {min}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ClassesSection;
