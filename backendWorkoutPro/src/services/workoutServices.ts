// In-memory storage for workout plans
const workoutPlans: { [key: string]: any } = {};

const startWorkoutPlan = (userId: string, startDate: Date) => {
    if (!userId || !startDate) {
        throw new Error('Invalid input');
    }

    // Store the workout plan in memory
    workoutPlans[userId] = {
        startDate,
        createdAt: new Date(),
    };

    return {
        message: 'Workout plan started successfully',
        startDate,
    };
};

export default {
    startWorkoutPlan,
};
