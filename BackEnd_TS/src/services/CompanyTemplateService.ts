import Template from '../models/Template';
import Bus from '../models/Bus';

export class CompanyTemplateService {
  static async listCompanyTemplates(
    page: number,
    pageSize: number,
    search?: string,
    busId?: string,
    busRouteId?: string,
    isActive?: boolean,
    companyId?: string
  ) {
    let query = Template.query()
      .withGraphFetched('[bus.[type_buses], busRoute.[route.[startLocation, endLocation]], company]');

    if (companyId) {
      query = query.where('templates.companyId', companyId);
    }

    if (search) {
      query = query.where((builder) => {
        builder.where('templates.name', 'ilike', `%${search}%`);
      });
    }

    if (busId) {
      query = query.where('templates.busId', busId);
    }

    if (busRouteId) {
      query = query.where('templates.busRoutesId', busRouteId);
    }

    if (isActive !== undefined) {
      query = query.where('templates.is_active', isActive);
    }

    const total = await query.resultSize();
    const data = await query
      .orderBy('templates.createdAt', 'desc')
      .page(page - 1, pageSize);

    return {
      data: data.results,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  static async getTemplateById(id: string, companyId?: string) {
    const query = Template.query()
      .findById(id)
      .withGraphFetched('[bus.[type_buses], busRoute.[route.[departure, destination]], company]');

    const template = await query;

    if (!template) {
      throw new Error('Template không tồn tại');
    }

    if (companyId && template.companyId !== companyId) {
      throw new Error('Không có quyền truy cập template này');
    }

    return template;
  }

  static async createTemplate(data: {
    name: string;
    busRoutesId: string;
    busId: string;
    companyId: string;
    is_active?: boolean;
  }) {
    const bus = await Bus.query().findById(data.busId);
    if (!bus) {
      throw new Error('Xe không tồn tại');
    }

    if (bus.companyId !== data.companyId) {
      throw new Error('Xe không thuộc nhà xe này');
    }

    const template = await Template.query().insert({
      ...data,
      is_active: data.is_active !== undefined ? data.is_active : true,
    });

    return template;
  }

  static async updateTemplate(
    id: string,
    data: {
      name?: string;
      busRoutesId?: string;
      busId?: string;
      is_active?: boolean;
    },
    companyId?: string
  ) {
    const template = await Template.query().findById(id);

    if (!template) {
      throw new Error('Template không tồn tại');
    }

    if (companyId && template.companyId !== companyId) {
      throw new Error('Không có quyền cập nhật template này');
    }

    if (data.busId) {
      const bus = await Bus.query().findById(data.busId);
      if (!bus) {
        throw new Error('Xe không tồn tại');
      }

      if (bus.companyId !== template.companyId) {
        throw new Error('Xe không thuộc nhà xe này');
      }
    }

    const updated = await Template.query().patchAndFetchById(id, data);

    return updated;
  }

  static async toggleTemplateActive(id: string, isActive: boolean, companyId?: string) {
    const template = await Template.query().findById(id);

    if (!template) {
      throw new Error('Template không tồn tại');
    }

    if (companyId && template.companyId !== companyId) {
      throw new Error('Không có quyền cập nhật template này');
    }

    await Template.query().patchAndFetchById(id, { is_active: isActive });

    return { message: `${isActive ? 'Kích hoạt' : 'Tạm dừng'} template thành công` };
  }

  static async bulkToggleTemplateActive(ids: string[], isActive: boolean, companyId?: string) {
    if (companyId) {
      const templates = await Template.query().findByIds(ids);
      const unauthorizedTemplates = templates.filter(t => t.companyId !== companyId);
      
      if (unauthorizedTemplates.length > 0) {
        throw new Error('Không có quyền cập nhật một số template');
      }
    }

    await Template.query()
      .patch({ is_active: isActive })
      .whereIn('id', ids);

    return { message: `${isActive ? 'Kích hoạt' : 'Tạm dừng'} ${ids.length} template thành công` };
  }
}
