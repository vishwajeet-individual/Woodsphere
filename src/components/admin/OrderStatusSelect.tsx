'use client';

import { Select, MenuItem, SelectChangeEvent, Chip } from '@mui/material';
import { useState } from 'react';
import { updateOrderStatus } from '@/lib/actions/admin';
import { toast } from 'sonner';

const STATUS_COLORS: any = {
  PENDING: 'warning',
  PROCESSING: 'info',
  SHIPPED: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'error'
};

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: SelectChangeEvent) => {
    const newStatus = e.target.value as any;
    setStatus(newStatus);
    setLoading(true);

    const res = await updateOrderStatus(orderId, newStatus);
    
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
      setStatus(currentStatus); // Revert on error
    } else {
      toast.success("Order updated");
    }
  };

  return (
    <Select
      value={status}
      onChange={handleChange}
      size="small"
      disabled={loading}
      sx={{ 
        minWidth: 140, 
        borderRadius: 2,
        '& .MuiSelect-select': { py: 0.5, display: 'flex', alignItems: 'center', gap: 1 }
      }}
    >
      {Object.keys(STATUS_COLORS).map((s) => (
        <MenuItem key={s} value={s}>
           <Chip label={s} size="small" color={STATUS_COLORS[s]} sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }} />
        </MenuItem>
      ))}
    </Select>
  );
}