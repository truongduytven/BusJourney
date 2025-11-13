import Bus from '../models/Bus'
import cloudinary from '../config/cloudinary'

export class BusService {
  static async listBuses(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    typeBusId?: string,
    busCompanyId?: string
  ) {
    const offset = (page - 1) * pageSize

    let query = Bus.query().withGraphFetched('[type_buses, bus_companies]')

    if (busCompanyId) {
      query = query.where('companyId', busCompanyId)
    }

    if (search) {
      query = query.where('licensePlate', 'ilike', `%${search}%`)
    }

    if (typeBusId) {
      query = query.where('typeBusId', typeBusId)
    }

    const buses = await query.limit(pageSize).offset(offset)

    const total = await query.resultSize()

    return {
      data: buses,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  }

  static async getBusById(id: string, busCompanyId?: string) {
    const query = Bus.query().findById(id).withGraphFetched('[type_buses, bus_companies]')

    const bus = await query

    if (!bus) {
      throw new Error('Không tìm thấy xe')
    }

    if (busCompanyId && bus.companyId !== busCompanyId) {
      throw new Error('Bạn không có quyền xem xe này')
    }

    return bus
  }

  static async createBus(data: {
    licensePlate: string
    typeBusId: string
    busCompanyId: string
    extensions?: string[]
    images?: string[]
  }) {
    const existingBus = await Bus.query().where('licensePlate', data.licensePlate).first()

    if (existingBus) {
      throw new Error('Biển số xe này đã tồn tại')
    }

    const bus = await Bus.query().insertAndFetch({
      licensePlate: data.licensePlate,
      typeBusId: data.typeBusId,
      companyId: data.busCompanyId,
      extensions: data.extensions || [],
      images: data.images || []
    })

    return await this.getBusById(bus.id, data.busCompanyId)
  }

  static async updateBus(
    id: string,
    data: {
      licensePlate?: string
      typeBusId?: string
      extensions?: string[]
      images?: string[]
    },
    busCompanyId?: string
  ) {
    const bus = await Bus.query().findById(id)

    if (!bus) {
      throw new Error('Không tìm thấy xe')
    }

    if (busCompanyId && bus.companyId !== busCompanyId) {
      throw new Error('Bạn không có quyền chỉnh sửa xe này')
    }

    if (data.licensePlate && data.licensePlate !== bus.licensePlate) {
      const existingBus = await Bus.query().where('licensePlate', data.licensePlate).whereNot('id', id).first()

      if (existingBus) {
        throw new Error('Biển số xe này đã tồn tại')
      }
    }
    const formattedData: any = { ...data }

    if (data.extensions) {
      formattedData.extensions = JSON.stringify(data.extensions)
    }

    if (data.images) {
      formattedData.images = JSON.stringify(data.images)
    }

    await Bus.query().patchAndFetchById(id, formattedData)

    return await this.getBusById(id, busCompanyId)
  }

  static async deleteBus(id: string, busCompanyId?: string) {
    const bus = await Bus.query().findById(id)

    if (!bus) {
      throw new Error('Không tìm thấy xe')
    }

    if (busCompanyId && bus.companyId !== busCompanyId) {
      throw new Error('Bạn không có quyền xóa xe này')
    }

    await Bus.query().deleteById(id)

    return { message: 'Xóa xe thành công' }
  }
}
