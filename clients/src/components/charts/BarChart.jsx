import { BarChart as RC, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BarChart({ data, dataKey = 'value', xKey = 'name', color = '#3b82f6' }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RC data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </RC>
    </ResponsiveContainer>
  );
}