import React from 'react';
import {SKILL_LIST} from '../consts';

const SkillCheckSection = ({char, setCharacters, handleSkillCheck}) => {
    return (
        <section className="App-section">
            <h3>Skill Check for {char.name}</h3>
            <label>
                Skill:
                <select
                    value={char.skillCheckSkill || SKILL_LIST[0].name}
                    onChange={(e) =>
                        setCharacters((prevChars) =>
                            prevChars.map((c) => {
                                if (c.id === char.id) {
                                    return {...c, skillCheckSkill: e.target.value};
                                }
                                return c;
                            })
                        )
                    }
                >
                    {SKILL_LIST.map((skill) => (
                        <option key={skill.name} value={skill.name}>
                            {skill.name}
                        </option>
                    ))}
                </select>
            </label>
            <br/>
            <label>
                DC:
                <input
                    type="number"
                    value={char.skillCheckDC || 10}
                    onChange={(e) =>
                        setCharacters((prevChars) =>
                            prevChars.map((c) => {
                                if (c.id === char.id) {
                                    return {...c, skillCheckDC: parseInt(e.target.value)};
                                }
                                return c;
                            })
                        )
                    }
                />
            </label>
            <br/>
            <button onClick={() => handleSkillCheck(char.id)}>Roll</button>
            {char.skillCheckResult && (
                <div>
                    <p>Roll: {char.skillCheckResult.roll}</p>
                    <p>Total (Roll + Skill): {char.skillCheckResult.total}</p>
                    <p>{char.skillCheckResult.success ? 'Success' : 'Failure'}</p>
                </div>
            )}
        </section>
    );
};

export default SkillCheckSection;
