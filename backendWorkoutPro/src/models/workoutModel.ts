import mongoose, { Schema, Document } from 'mongoose';

interface IWorkoutPlan extends Document {
    userId: string;
    startDate?: Date;
    workoutData: any[];
    filePath?: string;  // Optional: if you want to keep track of the uploaded file path
    markedDates: {[key: string]: any;}
    duration: number
}

const WorkoutPlanSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
    },
    workoutData: {
        type: [Schema.Types.Mixed], // Define more specific types as necessary
        required: true,
    },
    markedDates:{
        type: [Schema.Types.Mixed],
    },
    duration: {
        type: Number
    },
    filePath: {
        type: String,
    },
});

const WorkoutPlan = mongoose.model<IWorkoutPlan>('WorkoutPlan', WorkoutPlanSchema);

export default WorkoutPlan;
