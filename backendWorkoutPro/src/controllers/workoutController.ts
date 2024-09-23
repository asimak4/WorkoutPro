import { Request, Response } from 'express';
import pako from 'pako';
import Workout from '../models/workoutModel';

// In-memory storage for simplicity; replace with a database in production
const userWorkoutPlans: { [key: string]: any[] } = {};

export const saveWorkoutPlan1 = (req: Request, res: Response) => {
    const { userId, workoutData } = req.body;

    if (!userId || !workoutData) {
        return res.status(400).json({ message: 'Missing userId or workoutData' });
    }

    // Save the workout data for the user
    userWorkoutPlans[userId] = workoutData;
    const decompressedData = JSON.parse(pako.inflate(workoutData, { to: 'string' }));
    console.log("Workout Data: ", decompressedData);
    return res.status(200).json({ message: 'Workout plan saved successfully' });
};


export const saveWorkoutPlan = async (req: Request, res: Response) => {
  const { userId, startDate, workoutData } = req.body;

  try {
    console.log("We hit here? ");
    const decompressedData = JSON.parse(pako.inflate(workoutData, { to: 'string' }));
    const workout = new Workout({ userId, startDate, decompressedData });
    await workout.save();

    return res.status(201).json({ message: 'Workout plan saved successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving workout plan!!!', error });
  }
};


export const getWorkoutPlan = async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    try {
      const workout = await Workout.findOne({ userId });
  
      if (!workout) {
        return res.status(404).json({ message: 'No workout plan found for this user' });
      }
  
      return res.status(200).json(workout);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching workout plan', error });
    }
  };
  
