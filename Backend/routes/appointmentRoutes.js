import express from 'express';
import {
  scheduleAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getAppointmentsByUser,
} from '../controllers/appointmentController.js';

const appRouter = express.Router();

appRouter.post('/schedule', scheduleAppointment);
appRouter.patch('/cancel/:appointmentId', cancelAppointment);
appRouter.patch('/reschedule/:appointmentId', rescheduleAppointment);
appRouter.get('/user/:userId', getAppointmentsByUser);

export default appRouter;
