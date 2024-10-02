import { useState, useEffect } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts';
import CharacterList from './components/CharacterList';
import Character from './components/Character';
import PartySkillCheck from './components/PartySkillCheck';
import {
    calculateModifier,
    calculateTotalSkillPoints,
    calculateAllocatedSkillPoints,
} from './utils/utils';

const App = () => {
    /**
     * Creates a new character with default attributes and skills.
     * @returns {Object} A new character object.
     */
    const createNewCharacter = () => {
        // Initialize all attributes to 10
        const initialAttributes = ATTRIBUTE_LIST.reduce((acc, attr) => {
            acc[attr] = 10;
            return acc;
        }, {});

        // Initialize all skill points to 0
        const initialSkillPoints = SKILL_LIST.reduce((acc, skill) => {
            acc[skill.name] = 0;
            return acc;
        }, {});

        // Generate a unique ID using the current timestamp and a random number
        const id = `${Date.now()}-${Math.random()}`;

        return {
            id,
            name: `Character ${id}`,
            attributes: initialAttributes,
            skillPoints: initialSkillPoints,
            selectedClass: null,
            skillCheckResult: null,
            skillCheckSkill: SKILL_LIST[0].name,
            skillCheckDC: 10,
        };
    };

    // State management for characters and party skill checks
    const [characters, setCharacters] = useState([createNewCharacter()]);
    const [partySkillCheckSkill, setPartySkillCheckSkill] = useState(SKILL_LIST[0].name);
    const [partySkillCheckDC, setPartySkillCheckDC] = useState(10);
    const [partySkillCheckResult, setPartySkillCheckResult] = useState(null);

    /**
     * Fetches initial character data from the API when the component mounts.
     */
    useEffect(() => {
        fetch('https://recruiting.verylongdomaintotestwith.ca/api/rstojano/character')
            .then((response) => response.json())
            .then((data) => {
                const parsedBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
                if (Array.isArray(parsedBody?.characters)) {
                    setCharacters(parsedBody.characters);
                }
            })
            .catch((error) => console.error('Error fetching characters:', error));
    }, []);

    /**
     * Saves the current list of characters to the API.
     */
    const saveCharacters = () => {
        fetch('https://recruiting.verylongdomaintotestwith.ca/api/rstojano/character', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ characters }),
        })
            .then((response) => response.json())
            .then((data) => console.log('Characters saved:', data))
            .catch((error) => console.error('Error saving characters:', error));
    };

    /**
     * Updates a character's attribute, incrementing or decrementing its value.
     * Ensures total attribute points do not exceed 70 and individual attributes do not go below 7.
     * @param {string} charId - The ID of the character to update.
     * @param {string} attr - The attribute to update.
     * @param {boolean} increment - True to increment, false to decrement.
     */
    const updateAttribute = (charId, attr, increment) => {
        setCharacters((prevChars) =>
            prevChars.map((char) => {
                if (char.id !== charId) return char;

                const totalAttributes = Object.values(char.attributes).reduce((sum, value) => sum + value, 0);
                const updatedValue = char.attributes[attr] + (increment ? 1 : -1);
                const canUpdate = increment ? totalAttributes < 70 : updatedValue >= 7;

                if (!canUpdate) return char;

                return {
                    ...char,
                    attributes: { ...char.attributes, [attr]: updatedValue },
                };
            })
        );
    };

    // Helper functions to increment or decrement an attribute
    const incrementAttribute = (charId, attr) => updateAttribute(charId, attr, true);
    const decrementAttribute = (charId, attr) => updateAttribute(charId, attr, false);

    /**
     * Checks if a character meets the minimum requirements for a given class.
     * @param {Object} char - The character object.
     * @param {string} clsName - The name of the class to check.
     * @returns {boolean} True if the character meets the requirements, false otherwise.
     */
    const meetsClassRequirements = (char, clsName) => {
        const classMinimums = CLASS_LIST[clsName];
        return Object.entries(classMinimums).every(([attr, min]) => char.attributes[attr] >= min);
    };

    /**
     * Updates a character's skill points for a given skill.
     * Ensures total allocated points do not exceed the maximum available.
     * @param {string} charId - The ID of the character to update.
     * @param {string} skillName - The name of the skill to update.
     * @param {boolean} increment - True to increment, false to decrement.
     */
    const updateSkillPoints = (charId, skillName, increment) => {
        setCharacters((prevChars) =>
            prevChars.map((char) => {
                if (char.id !== charId) return char;

                const totalAllocated = calculateAllocatedSkillPoints(char);
                const totalSkillPoints = calculateTotalSkillPoints(char, calculateModifier);
                const currentPoints = char.skillPoints[skillName];
                const newPoints = increment ? currentPoints + 1 : currentPoints - 1;
                const canUpdate = increment ? totalAllocated < totalSkillPoints : currentPoints > 0;

                if (!canUpdate) return char;

                return {
                    ...char,
                    skillPoints: { ...char.skillPoints, [skillName]: newPoints },
                };
            })
        );
    };

    // Helper functions to increment or decrement skill points
    const incrementSkill = (charId, skillName) => updateSkillPoints(charId, skillName, true);
    const decrementSkill = (charId, skillName) => updateSkillPoints(charId, skillName, false);

    /**
     * Performs a skill check for an individual character.
     * @param {string} charId - The ID of the character performing the skill check.
     */
    const handleSkillCheck = (charId) => {
        setCharacters((prevChars) =>
            prevChars.map((char) => {
                if (char.id !== charId) return char;

                // Roll a random number between 1 and 20 (inclusive)
                const roll = Math.floor(Math.random() * 20) + 1;

                // Determine the skill and its attribute modifier
                const skillName = char.skillCheckSkill || SKILL_LIST[0].name;
                const skill = SKILL_LIST.find((s) => s.name === skillName);
                const attributeModifier = calculateModifier(char.attributes[skill.attributeModifier]);

                // Calculate total skill value and determine success
                const totalSkillValue = char.skillPoints[skill.name] + attributeModifier;
                const total = roll + totalSkillValue;
                const success = total >= (char.skillCheckDC || 10);

                return { ...char, skillCheckResult: { roll, total, success } };
            })
        );
    };

    /**
     * Performs a skill check for the entire party, using the character with the highest skill total.
     */
    const handlePartySkillCheck = () => {
        if (!characters.length) return;

        let bestCharacter = null;
        let highestSkillValue = -Infinity;

        // Find the character with the highest total skill value for the selected skill
        characters.forEach((char) => {
            const skill = SKILL_LIST.find((s) => s.name === partySkillCheckSkill);
            const attributeModifier = calculateModifier(char.attributes[skill.attributeModifier]);
            const totalSkillValue = char.skillPoints[skill.name] + attributeModifier;

            if (totalSkillValue > highestSkillValue) {
                highestSkillValue = totalSkillValue;
                bestCharacter = char;
            }
        });

        if (bestCharacter) {
            // Roll a random number between 1 and 20 (inclusive)
            const roll = Math.floor(Math.random() * 20) + 1;
            const total = roll + highestSkillValue;
            const success = total >= partySkillCheckDC;

            setPartySkillCheckResult({
                character: bestCharacter.name,
                roll,
                total,
                success,
            });
        }
    };

    // Character management functions
    /**
     * Adds a new character to the list.
     */
    const addCharacter = () => setCharacters((prevChars) => [...prevChars, createNewCharacter()]);

    /**
     * Removes a character from the list by ID.
     * @param {string} id - The ID of the character to remove.
     */
    const removeCharacter = (id) => {
        setCharacters((prevChars) => prevChars.filter((char) => char.id !== id));
    };

    /**
     * Updates a character's name.
     * @param {string} id - The ID of the character to update.
     * @param {string} newName - The new name for the character.
     */
    const updateCharacterName = (id, newName) => {
        setCharacters((prevChars) =>
            prevChars.map((char) => (char.id === id ? { ...char, name: newName } : char))
        );
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Character Management</h1>
            </header>

            {/* Character List Component */}
            <CharacterList
                characters={characters}
                addCharacter={addCharacter}
                removeCharacter={removeCharacter}
                updateCharacterName={updateCharacterName}
            />

            {/* Render details for each character */}
            <div className="Characters-Details">
                {characters.map((char) => (
                    <Character
                        key={char.id}
                        char={char}
                        calculateModifier={calculateModifier}
                        incrementAttribute={incrementAttribute}
                        decrementAttribute={decrementAttribute}
                        meetsClassRequirements={meetsClassRequirements}
                        incrementSkill={incrementSkill}
                        decrementSkill={decrementSkill}
                        setCharacters={setCharacters}
                        handleSkillCheck={handleSkillCheck}
                    />
                ))}
            </div>

            {/* Party Skill Check Component */}
            <PartySkillCheck
                characters={characters}
                partySkillCheckSkill={partySkillCheckSkill}
                setPartySkillCheckSkill={setPartySkillCheckSkill}
                partySkillCheckDC={partySkillCheckDC}
                setPartySkillCheckDC={setPartySkillCheckDC}
                partySkillCheckResult={partySkillCheckResult}
                handlePartySkillCheck={handlePartySkillCheck}
            />

            {/* Save Characters Button */}
            <section className="App-section">
                <button onClick={saveCharacters}>Save Characters</button>
            </section>
        </div>
    );
};

export default App;
