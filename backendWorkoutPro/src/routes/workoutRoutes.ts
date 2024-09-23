import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { processWorkoutPlan } from '../services/parseWorkoutFile';
import WorkoutPlan from '../models/workoutModel';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Files will be temporarily stored in 'uploads/' directory

// File Upload Route
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Create a directory for the user if it doesn't exist
        const userDir = path.join('uploads', userId);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        // Move the file to the user's directory
        const userFilePath = path.join(userDir, req.file.originalname);
        fs.renameSync(req.file.path, userFilePath);

        let parsedData;
        // Handle different file types
        if (req.file.mimetype === 'application/json') {
            // Parsing JSON file
            const rawData = fs.readFileSync(userFilePath, 'utf-8');
            parsedData = JSON.parse(rawData);
        } else if (
            req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            req.file.mimetype === 'application/vnd.ms-excel'
        ) {
            // Parsing Excel file
            const workbook = XLSX.readFile(userFilePath, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            parsedData = processWorkoutPlan(rawData);
        } else {
            // Unsupported file type
            fs.unlinkSync(userFilePath); // Cleanup
            return res.status(400).json({ message: 'Unsupported file type' });
        }

        // Save the parsed data and file path to MongoDB
        const workoutPlan = new WorkoutPlan({
            userId,
            workoutData: parsedData,
            filePath: userFilePath,
            startDate: undefined
        });
        await workoutPlan.save();

        // Send the parsed data back to the frontend
        res.status(200).json({ message: 'File parsed and saved successfully', data: parsedData });
    } catch (error: any) {
        console.error('File parsing failed:', error); // Log the detailed error
        res.status(500).json({ message: 'File parsing failed', error: error.message });
    }
});


// Get User's Workout Plan Route
router.get('/workout/:userId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const workoutPlan = await WorkoutPlan.findOne({ userId });

        if (!workoutPlan) {
            return res.status(404).json({ message: 'No workout plan found for this user' });
        }

        // Return both the parsed data and the file path
        res.status(200).json({
            message: 'Workout plan retrieved successfully',
            data: workoutPlan.workoutData,
            filePath: workoutPlan.filePath,  // You might return just the file name or a download link
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve workout plan', error: error.message });
    }
});

// Get User's Workout Plan Route
router.get('/workoutInfo/:userId', async (req: Request, res: Response) => {
    try {
        console.log("Here?")
        const userId = req.params.userId;
        console.log("user: ", userId);

        const workoutPlan = await WorkoutPlan.findOne({ userId });

        if (!workoutPlan) {
            return res.status(404).json({ message: 'No workout plan found for this user' });
        }

        // Return both the parsed data and the file path
        console.log("Workout Paln: ", workoutPlan);
        res.status(200).json({
            message: 'Workout info retrieved successfully',
            startDate: workoutPlan.startDate,
            workoutData: workoutPlan.workoutData,
            markedDates: workoutPlan?.markedDates || null,
            duration: workoutPlan?.duration || null
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve workout info', error: error.message });
    }
});

// Save Workout Plan Route
router.post('/save-workout', async (req: Request, res: Response) => {
    try {
        const { userId, startDate, markedDates, duration } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find the existing workout plan for the user
        let workoutPlan = await WorkoutPlan.findOne({ userId });

        if (workoutPlan) {
            // Update the existing workout plan
            workoutPlan.startDate = startDate;
            workoutPlan.markedDates = markedDates;
            workoutPlan.duration = duration;
            // Save the workout plan to the database
            console.log("Saving workout with start date: ", startDate);
            console.log("Saving workout with marked Dates: ", markedDates);
            console.log("Saving duration ", duration);

            await workoutPlan.save();
        } else {
            // Create a new workout plan if it doesn't exist
            // workoutPlan = new WorkoutPlan({
            //     userId,
            //     startDate,
            // });
            console.log("Workout not found.");
        }

        res.status(200).json({ message: 'Workout plan saved successfully', data: workoutPlan });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to save workout plan', error: error.message });
    }
});


export default router;
