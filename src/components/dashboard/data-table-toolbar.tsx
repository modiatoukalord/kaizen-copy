
'use client';

import { X } from 'lucide-react';
import type { Table } from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DateRangePicker } from '../ui/date-range-picker';
import { DateRange } from 'react-day-picker';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  categoryOptions: {
    label: string;
    value: string;
  }[];
  filterType?: 'income' | 'expense';
}

export function DataTableToolbar<TData>({
  table,
  categoryOptions,
  filterType,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [date, setDate] = React.useState<DateRange | undefined>();
  
  React.useEffect(() => {
    table.getColumn('date')?.setFilterValue(date);
  }, [date, table]);

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrer les transactions..."
          value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('description')?.setFilter(event.target.value)
          }
          className="h-10 w-[150px] lg:w-[250px]"
        />
        <DateRangePicker date={date} onDateChange={setDate} />
        {filterType === 'expense' && table.getColumn('parentCategory') && (
          <DataTableFacetedFilter
            column={table.getColumn('parentCategory')}
            title="Catégorie"
            options={categoryOptions}
          />
        )}
        {table.getColumn('category') && (
          <DataTableFacetedFilter
            column={table.getColumn('category')}
            title={filterType === 'expense' ? "Sous-catégorie" : "Catégorie"}
            options={categoryOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-10 px-2 lg:px-3"
          >
            Réinitialiser
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
