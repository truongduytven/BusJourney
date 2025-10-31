import { Request, Response } from 'express'
import City from '../models/City'
import { sendSuccess, handleControllerError } from '../utils/responseHelper'

export const getAllCities = async (req: Request, res: Response) => {
  try {
    const cities = await City.query()
    return sendSuccess(res, 'Lấy danh sách thành phố thành công', cities);
  } catch (error: any) {
    return handleControllerError(res, error, 'getAllCities');
  }
}
