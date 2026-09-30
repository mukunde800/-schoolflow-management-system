import { PieChart as RC, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function PieChart({ data, dataKey = 'value', nameKey = 'name' }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RC>
        <Pie data={data} dataKey={dataKey} nameKey={nameKey} outerRadius={100} label>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </RC>
    </ResponsiveContainer>
  );
}