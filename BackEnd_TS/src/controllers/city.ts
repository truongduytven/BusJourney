import { Request, Response } from 'express'
import City from '../models/City'

export const getAllCities = async (req: Request, res: Response) => {
  try {
    const cities = await City.query()
    res.status(200).json({
      message: 'Lấy danh sách thành phố thành công',
      data: cities,
      success: true
    })
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      message: 'Lỗi server',
      success: false
    })
  }
}
