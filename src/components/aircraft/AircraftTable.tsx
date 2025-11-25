import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Aircraft = Tables<'aircraft'>;

interface AircraftTableProps {
  aircraft: Aircraft[];
  onRowClick: (aircraft: Aircraft) => void;
}

const PAGE_SIZE = 20;

export function AircraftTable({ aircraft, onRowClick }: AircraftTableProps) {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<'registration' | 'predicted_next_maintenance_at'>('registration');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: 'registration' | 'predicted_next_maintenance_at') => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const sortedAircraft = [...aircraft].sort((a, b) => {
    let aVal: any = a[sortBy];
    let bVal: any = b[sortBy];

    if (sortBy === 'predicted_next_maintenance_at') {
      aVal = aVal ? new Date(aVal).getTime() : Infinity;
      bVal = bVal ? new Date(bVal).getTime() : Infinity;
    } else {
      aVal = aVal || '';
      bVal = bVal || '';
    }

    if (sortDir === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedAircraft.length / PAGE_SIZE);
  const paginatedAircraft = sortedAircraft.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const getReadinessBadge = (status: string | null) => {
    switch (status) {
      case 'ready':
        return <Badge variant="default" className="bg-green-600">Ready</Badge>;
      case 'in_maintenance':
        return <Badge variant="secondary">In Maintenance</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  const getAirworthinessBadge = (state: string | null) => {
    switch (state) {
      case 'airworthy':
        return <Badge variant="default" className="bg-green-600">Airworthy</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{state || 'Unknown'}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  onClick={() => handleSort('registration')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Registration
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Fleet Type</TableHead>
              <TableHead>Base</TableHead>
              <TableHead>Readiness</TableHead>
              <TableHead>Airworthiness</TableHead>
              <TableHead className="text-right">Health %</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort('predicted_next_maintenance_at')}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Next Maintenance
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Last Position</TableHead>
              <TableHead>Last Arrival</TableHead>
              <TableHead>Arrival Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAircraft.map((ac) => (
              <TableRow
                key={ac.id}
                className="cursor-pointer"
                onClick={() => onRowClick(ac)}
              >
                <TableCell className="font-medium">{ac.registration}</TableCell>
                <TableCell>{ac.fleet_type || '-'}</TableCell>
                <TableCell>{ac.base_airport_code || '-'}</TableCell>
                <TableCell>{getReadinessBadge(ac.readiness_status)}</TableCell>
                <TableCell>{getAirworthinessBadge(ac.airworthiness_state)}</TableCell>
                <TableCell className="text-right">
                  {ac.health_index !== null ? `${ac.health_index.toFixed(1)}%` : '-'}
                </TableCell>
                <TableCell>
                  {ac.predicted_next_maintenance_at ? (
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(ac.predicted_next_maintenance_at), {
                        addSuffix: true,
                      })}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {ac.last_position_at ? (
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(ac.last_position_at), {
                        addSuffix: true,
                      })}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{ac.last_arrival_airport || '-'}</TableCell>
                <TableCell>
                  {ac.last_flight_arrival_at ? (
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(ac.last_flight_arrival_at), {
                        addSuffix: true,
                      })}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {ac.is_aog && (
                    <Badge variant="destructive" className="font-semibold">
                      AOG
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Showing {page * PAGE_SIZE + 1} to {Math.min((page + 1) * PAGE_SIZE, aircraft.length)} of{' '}
            {aircraft.length} aircraft
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(0)}
              disabled={page === 0}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
