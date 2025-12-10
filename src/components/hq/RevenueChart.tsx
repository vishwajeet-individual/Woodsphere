'use client';

import { Box, Typography } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ data }: { data: any[] }) {
  return (
    <Box sx={{ bgcolor: '#fff', p: 3, borderRadius: 4, height: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>Revenue Trends (Last 7 Days)</Typography>
      
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0071e3" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#0071e3" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
          <Tooltip 
            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
          />
          <Area type="monotone" dataKey="value" stroke="#0071e3" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}