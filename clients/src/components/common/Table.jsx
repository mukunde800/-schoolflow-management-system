import Spinner from '../common/Spiner';

export default function Table({ columns, data, loading, onRowClick, emptyMessage = 'Aucune donnée' }) {
  if (loading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (!data?.length) return <div className="text-center p-8 text-gray-500">{emptyMessage}</div>;

  return (
    <div className="overflow-x-auto card">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((c) => (
                <td key={c.key} className="px-6 py-4 text-sm whitespace-nowrap">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}