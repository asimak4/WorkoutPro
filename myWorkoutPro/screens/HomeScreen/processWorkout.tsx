import { WorkoutBlock } from "./HomeScreen";

export const processWorkoutPlan = (rawData: any[]): WorkoutBlock[] => {
    const workoutBlocks: WorkoutBlock[] = [];
    let currentBlock: WorkoutBlock | null = null;
    let currentWeek: { days: any[]; week: string } | null = null;
    let currentDay: { exercises: any[]; day: string } | null = null;
    
    let startedParsing = false;

    rawData.forEach((row, index) => {
        // Check if the parsing should start
        if (!startedParsing && row[0] && (row[0].includes('BLOCK') || row[0].includes('Week') || row[0].trim() !== '')) {
            startedParsing = true; // Start processing relevant data from this point onward
        }

        if (!startedParsing) return; // Skip rows until the first BLOCK, Week, or Day is found

        if (row[0] && row[0].includes('BLOCK')) {
            currentBlock = { block: row[0], weeks: [] };
            workoutBlocks.push(currentBlock);
        } else if (row[0] && row[0].includes('Week')) {
            if (!currentBlock) {
                console.error(`Error at row ${index}: No block found when parsing week.`);
                return;
            }
            currentWeek = { week: row[0], days: [] };
            currentBlock.weeks.push(currentWeek);
        } else if (row[0] && row[0].trim() !== '' && !row[0].includes('Week') && !row[0].includes('BLOCK')) {
            if (!currentWeek) {
                console.error(`Error at row ${index}: No week found when parsing day.`);
                return;
            }
            currentDay = { day: row[0], exercises: [] };
            currentWeek.days.push(currentDay);
        }

        if (row[1]) {  // Ensures exercises are captured even on the first valid day
            if (!currentDay) {
                console.error(`Error at row ${index}: No day found when parsing exercises.`);
                return;
            }
            const exercise = {
                exercise_name: row[1],
                intensity: row[2],
                warmup_sets: row[3],
                working_sets: row[4],
                reps: row[5],
                substitution_1: row[13],
                substitution_2: row[14],
                notes: row[15],
            };
            currentDay.exercises.push(exercise);
        }
    });

    return workoutBlocks;
};
