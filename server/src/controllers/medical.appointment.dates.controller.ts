import type { NextFunction, Request, Response } from 'express'
import type { User } from '../entities'
import { ERROR_MSGS } from '../constants/errorMsgs'
import { HTTPCODES } from '../constants/httpCodes'
import { MESSAGES } from '../constants/msgs'
import { medicalAppointmentDatesService } from '../services'
import { AppError } from '../utils/app.error'

export const createDates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionUser } = req
    const { date, hours } = req.safeData?.body
    const medicalAppointmentDates =
      await medicalAppointmentDatesService.createMedicalAppointmentDates(
        sessionUser as User,
        date,
        hours
      )

    //const datesToFrontEnd = medicalAppointmentDates

    return res.status(HTTPCODES.CREATED).json({
      status: MESSAGES.SUCCESS,
      message: MESSAGES.MEDICAL_APPOINTMENT_DATE_CREATED,
      medicalAppointmentDates
    })
  } catch (err) {
    if (!(err instanceof AppError)) {
      next(
        new AppError(
          ERROR_MSGS.MEDICAL_APPOINTMENT_DATE_CREATE_FAIL,
          HTTPCODES.INTERNAL_SERVER_ERROR
        )
      )
      return
    }
    next(err)
  }
}
