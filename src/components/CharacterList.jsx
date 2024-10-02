import React from 'react';

const CharacterList = ({characters, addCharacter, removeCharacter, updateCharacterName}) => {
    return (
        <section className="App-section">
            <h2>Characters</h2>
            <button onClick={addCharacter}>Add Character</button>
            <div className="Character-List">
                {characters.map((char) => (
                    <div key={char.id} className="Character-Item">
                        <input
                            type="text"
                            value={char.name}
                            onChange={(e) => updateCharacterName(char.id, e.target.value)}
                        />
                        <button onClick={() => removeCharacter(char.id)}>Remove</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CharacterList;
