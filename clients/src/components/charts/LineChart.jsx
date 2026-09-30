import { LineChart as RC, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LineChart({ data, dataKey = 'value', xKey = 'name', color = '#3b82f6' }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RC data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
      </RC>
    </ResponsiveContainer>
  );
}