import type { NextFunction, Request, Response } from 'express'
import { ERROR_MSGS } from '../constants/errorMsgs'
import { HTTPCODES } from '../constants/httpCodes'
import { MESSAGES } from '../constants/msgs'
import { patientService } from '../services'
import { AppError } from '../utils/app.error'

export const getPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // obtener el id del paciente
    const { sessionUser } = req
    const patient = await patientService.findPatient(
      { user: { id: sessionUser?.id } },
      false,
      {
        medicalAppointments: {
          medicalAppointmentDate: {
            doctor: { user: true }
          }
        }
      },
      true
    )

    return res.status(HTTPCODES.OK).json({
      status: MESSAGES.SUCCESS,
      patient
    })
  } catch (err) {
    console.log(err)
    if (!(err instanceof AppError)) {
      next(
        new AppError(
          ERROR_MSGS.PATIENT_NOT_FOUND,
          HTTPCODES.INTERNAL_SERVER_ERROR
        )
      )
      return
    }
    next(err)
  }
}

// Cancelar cita de parte del paciente

export const cancelPatientAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.safeData?.params

    await patientService.cancelPatientAppointment(id)

    return res.status(HTTPCODES.NO_CONTENT).json({
      status: MESSAGES.SUCCESS
    })
  } catch (err) {
    if (!(err instanceof AppError)) {
      next(
        new AppError(
          ERROR_MSGS.MEDICAL_APPOINTMENT_DATES_INVALID_TYPE,
          HTTPCODES.INTERNAL_SERVER_ERROR
        )
      )
    }
  }
}

export const patientInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.safeData?.params
    const { patientInfo, medicalRecordInfo, patientMedicalHistories } =
      await patientService.getPatientInfo(id)

    return res.status(HTTPCODES.OK).json({
      status: MESSAGES.SUCCESS,
      patientInfo,
      medicalRecordInfo,
      patientMedicalHistories
    })
  } catch (err) {
    console.log(err)
    if (!(err instanceof AppError)) {
      next(
        new AppError(
          ERROR_MSGS.PATIENT_NOT_FOUND,
          HTTPCODES.INTERNAL_SERVER_ERROR
        )
      )
      return
    }
    next(err)
  }
}
