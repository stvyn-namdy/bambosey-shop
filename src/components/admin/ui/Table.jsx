import { cn } from '@/utils/helpers';

const Table = ({ className, children, ...props }) => {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table
        className={cn('min-w-full divide-y divide-gray-300', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ className, children, ...props }) => {
  return (
    <thead className={cn('bg-gray-50', className)} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({ className, children, ...props }) => {
  return (
    <tbody className={cn('bg-white divide-y divide-gray-200', className)} {...props}>
      {children}
    </tbody>
  );
};

const TableRow = ({ className, children, ...props }) => {
  return (
    <tr className={cn('hover:bg-gray-50', className)} {...props}>
      {children}
    </tr>
  );
};

const TableHead = ({ className, children, ...props }) => {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

const TableCell = ({ className, children, ...props }) => {
  return (
    <td
      className={cn('px-6 py-4 whitespace-nowrap text-sm text-gray-900', className)}
      {...props}
    >
      {children}
    </td>
  );
};

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export default Table;