import React from 'react';
import { SKILL_LIST } from '../consts';

const PartySkillCheck = ({
                             partySkillCheckSkill,
                             setPartySkillCheckSkill,
                             partySkillCheckDC,
                             setPartySkillCheckDC,
                             partySkillCheckResult,
                             handlePartySkillCheck,
                         }) => {
    return (
        <section className="App-section">
            <h2>Party Skill Check</h2>
            <label>
                Skill:
                <select
                    value={partySkillCheckSkill}
                    onChange={(e) => setPartySkillCheckSkill(e.target.value)}
                >
                    {SKILL_LIST.map((skill) => (
                        <option key={skill.name} value={skill.name}>
                            {skill.name}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                DC:
                <input
                    type="number"
                    value={partySkillCheckDC}
                    onChange={(e) => setPartySkillCheckDC(parseInt(e.target.value))}
                />
            </label>
            <br />
            <button onClick={handlePartySkillCheck}>Roll</button>
            {partySkillCheckResult && (
                <div>
                    <p>Character: {partySkillCheckResult.character}</p>
                    <p>Roll: {partySkillCheckResult.roll}</p>
                    <p>Total (Roll + Skill): {partySkillCheckResult.total}</p>
                    <p>{partySkillCheckResult.success ? 'Success' : 'Failure'}</p>
                </div>
            )}
        </section>
    );
};

export default PartySkillCheck;
