import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { Template, CreateTemplateRequest, BusRoute } from '@/types/companyTemplate';
import type { Bus } from '@/types/bus';

interface TemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: Template | null;
  onSubmit: (data: CreateTemplateRequest) => void;
  buses: Bus[];
  busRoutes: BusRoute[];
}

export function TemplateModal({
  open,
  onOpenChange,
  template,
  onSubmit,
  buses,
  busRoutes,
}: TemplateModalProps) {
  const [isActive, setIsActive] = useState(true);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTemplateRequest>();

  const selectedBusRouteId = watch('busRoutesId');
  const selectedBusId = watch('busId');

  useEffect(() => {
    if (template) {
      setValue('name', template.name);
      setValue('busRoutesId', template.busRoutesId);
      setValue('busId', template.busId);
      setIsActive(template.isActive);
    } else {
      reset();
      setIsActive(true);
    }
  }, [template, setValue, reset]);

  const handleFormSubmit = (data: CreateTemplateRequest) => {
    onSubmit({
      ...data,
      is_active: isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Cập nhật template' : 'Tạo template mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
          <div className='grid space-y-2'>
            <Label htmlFor="name">Tên Template *</Label>
            <Input
              id="name"
              {...register('name', {
                required: 'Vui lòng nhập tên template',
              })}
              placeholder="VD: Template Sài Gòn - Đà Lạt"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid space-y-2">
            <Label htmlFor="busRoutesId">Tuyến đường *</Label>
            <Select
              value={selectedBusRouteId}
              onValueChange={(value) => setValue('busRoutesId', value)}
            >
              <SelectTrigger id="busRoutesId">
                <SelectValue placeholder="Chọn tuyến đường" />
              </SelectTrigger>
              <SelectContent>
                {busRoutes.map((route) => (
                   <SelectItem key={route.id} value={route.id}>
                    {route.route?.startLocation?.name} → {route.route?.endLocation?.name}
                   </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.busRoutesId && (
              <p className="text-sm text-red-500 mt-1">Vui lòng chọn tuyến đường</p>
            )}
          </div>

          <div className='grid space-y-2'>
            <Label htmlFor="busId">Xe *</Label>
            <Select
              value={selectedBusId}
              onValueChange={(value) => setValue('busId', value)}
            >
              <SelectTrigger id="busId">
                <SelectValue placeholder="Chọn xe" />
              </SelectTrigger>
              <SelectContent>
                {buses.map((bus) => (
                  <SelectItem key={bus.id} value={bus.id}>
                    {bus.licensePlate} {bus.type_buses && `- ${bus.type_buses.name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.busId && (
              <p className="text-sm text-red-500 mt-1">Vui lòng chọn xe</p>
            )}
          </div>

          <div className="flex items-center space-x-2 mt-8">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is_active">Hoạt động</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {template ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
