# Notes System Frontend Language

This file defines frontend-local vocabulary. The complete product language is maintained in the backend repository root `CONTEXT.md`.

## Language

**Pilot Mode**:
The public JobTI and fall-recruiting experience that runs from static assets and browser-local state.
_Avoid_: Demo mode, frontend-only product

**Full-Product Mode**:
The broader API-backed Notes System experience retained behind product controls.
_Avoid_: Production mode

**Static Mirror**:
A frontend copy of approved backend-generated content used for static delivery.
_Avoid_: Source content, canonical content

**Product Mode Control**:
A configuration boundary that hides or exposes a coherent product surface without deleting its implementation.
_Avoid_: Dead-code flag

**Career Run**:
A short, browser-local playthrough in which a Graduate encounters recruiting Events, makes Choices, and develops Attributes and behavioral signals until an Ending is reached.
_Avoid_: Character account, saved career profile

**Event**:
A configured recruiting situation that can appear when its stage and state Requirements are satisfied. An Event offers two to four Choices.
_Avoid_: Question, level

**Choice**:
A player action within an Event. It changes Attributes, counters, behavioral dimensions, and future Event weights; it is not a correct-answer option.
_Avoid_: Quiz answer

**Ending**:
A description of what happened during one Career Run, calculated separately from the JobTI Persona that describes how the player tended to act.
_Avoid_: Personality result

**Path Signal**:
An explainable observation from a Career Run that configures an editable default in the Personalized Career Path.
_Avoid_: Career suitability recommendation
