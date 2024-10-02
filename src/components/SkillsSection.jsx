import React from 'react';
import {SKILL_LIST} from "../consts";

const SkillsSection = ({
                           char,
                           calculateModifier,
                           incrementSkill,
                           decrementSkill,
                           totalSkillPoints,
                           totalAllocatedSkillPoints,
                       }) => {
    return (
        <section className="App-section">
            <h3>Skills</h3>
            <p>
                Total Skill Points: {totalSkillPoints} | Allocated Skill Points: {totalAllocatedSkillPoints}
            </p>
            {SKILL_LIST.map((skill) => {
                const pointsSpent = char.skillPoints[skill.name];
                const attributeModifierValue = calculateModifier(
                    char.attributes[skill.attributeModifier]
                );
                const totalSkillValue = pointsSpent + attributeModifierValue;
                return (
                    <div key={skill.name}>
                        <strong>{skill.name}</strong> - Points: {pointsSpent}
                        <button onClick={() => incrementSkill(char.id, skill.name)}>+</button>
                        <button onClick={() => decrementSkill(char.id, skill.name)}>-</button>
                        Modifier ({skill.attributeModifier}): {attributeModifierValue >= 0 ? '+' : ''}
                        {attributeModifierValue} Total: {totalSkillValue >= 0 ? '+' : ''}
                        {totalSkillValue}
                    </div>
                );
            })}
        </section>
    );
};

export default SkillsSection;
