import React from 'react';
import AttributesSection from './AttributesSection';
import ClassesSection from './ClassesSection';
import SkillsSection from './SkillsSection';
import SkillCheckSection from './SkillCheckSection';
import {calculateTotalSkillPoints, calculateAllocatedSkillPoints} from '../utils/utils';

const Character = ({
                       char,
                       calculateModifier,
                       incrementAttribute,
                       decrementAttribute,
                       meetsClassRequirements,
                       setCharacters,
                       incrementSkill,
                       decrementSkill,
                       handleSkillCheck,
                   }) => {
    const totalAttributes = Object.values(char.attributes).reduce((sum, val) => sum + val, 0);
    const totalSkillPoints = calculateTotalSkillPoints(char, calculateModifier);
    const totalAllocatedSkillPoints = calculateAllocatedSkillPoints(char);

    return (
        <div className="Character-Section">
            {/* Character Name */}
            <h2>{char.name}</h2>

            {/* Attributes Section */}
            <AttributesSection
                char={char}
                totalAttributes={totalAttributes}
                calculateModifier={calculateModifier}
                incrementAttribute={incrementAttribute}
                decrementAttribute={decrementAttribute}
            />

            {/* Classes Section */}
            <ClassesSection
                char={char}
                meetsClassRequirements={meetsClassRequirements}
                setCharacters={setCharacters}
            />

            {/* Skills Section */}
            <SkillsSection
                char={char}
                calculateModifier={calculateModifier}
                incrementSkill={incrementSkill}
                decrementSkill={decrementSkill}
                totalSkillPoints={totalSkillPoints}
                totalAllocatedSkillPoints={totalAllocatedSkillPoints}
            />

            {/* Skill Check Section */}
            <SkillCheckSection
                char={char}
                setCharacters={setCharacters}
                calculateModifier={calculateModifier}
                handleSkillCheck={handleSkillCheck}
            />
        </div>
    );
};

export default Character;
