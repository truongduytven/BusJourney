import { Request, Response } from 'express'
import { CompanyTripPointService } from '../services/CompanyTripPointService'

export const listCompanyTripPoints = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 10
    const search = req.query.search as string
    const tripId = req.query.tripId as string
    const pointId = req.query.pointId as string
    const type = req.query.type as string
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined
    const companyId = (req as any).user?.companyId

    const result = await CompanyTripPointService.listCompanyTripPoints(
      page,
      pageSize,
      search,
      tripId,
      pointId,
      type,
      isActive,
      companyId
    )

    res.json({
      success: true,
      message: 'Lấy danh sách điểm đón/trả thành công',
      ...result
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách điểm đón/trả'
    })
  }
}

export const getTripPointById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const companyId = (req as any).user?.companyId

    const tripPoint = await CompanyTripPointService.getTripPointById(id, companyId)

    res.json({
      success: true,
      message: 'Lấy thông tin điểm đón/trả thành công',
      data: tripPoint
    })
  } catch (error: any) {
    res.status(error.message.includes('không tồn tại') ? 404 : 403).json({
      success: false,
      message: error.message
    })
  }
}

export const createTripPoint = async (req: Request, res: Response) => {
  try {
    const companyId = (req as any).user?.companyId
    const tripPoint = await CompanyTripPointService.createTripPoint(req.body, companyId)

    res.status(201).json({
      success: true,
      message: 'Tạo điểm đón/trả thành công',
      data: tripPoint
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi khi tạo điểm đón/trả'
    })
  }
}

export const updateTripPoint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const companyId = (req as any).user?.companyId

    const tripPoint = await CompanyTripPointService.updateTripPoint(id, req.body, companyId)

    res.json({
      success: true,
      message: 'Cập nhật điểm đón/trả thành công',
      data: tripPoint
    })
  } catch (error: any) {
    res.status(error.message.includes('không tồn tại') ? 404 : 403).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteTripPoint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const companyId = (req as any).user?.companyId

    const result = await CompanyTripPointService.deleteTripPoint(id, companyId)

    res.json({
      success: true,
      ...result
    })
  } catch (error: any) {
    res.status(error.message.includes('không tồn tại') ? 404 : 403).json({
      success: false,
      message: error.message
    })
  }
}

export const toggleTripPointStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { isActive } = req.body
    const companyId = (req as any).user?.companyId

    const result = await CompanyTripPointService.toggleTripPointStatus(id, isActive, companyId)

    res.json({
      success: true,
      ...result
    })
  } catch (error: any) {
    res.status(error.message.includes('không tồn tại') ? 404 : 403).json({
      success: false,
      message: error.message
    })
  }
}
