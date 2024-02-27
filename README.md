# hiit-happens
HIIT PWA Web App - L5 Solo Project for Web Programming

## Data Structures

### Exercise
An exercise is a single segment of a workout:
- `type`: `String` - the 
- `class`: `String` - 
- `duration`: `Number`
- `rest`: `Number` - the milliseconds spent resting after the exercise.

### Workout
A workout is a set of exercies
- `exercises`: `Array<Exercise>` - the set of exercises
- `lastUpdated`: `Date` - the metadata used to decide which version of the exercise (local/upstream) is newest.
