import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FleetSummaryBar } from '@/components/aircraft/FleetSummaryBar';
import { AircraftTable } from '@/components/aircraft/AircraftTable';
import { AircraftDrawer } from '@/components/aircraft/AircraftDrawer';
import type { Tables } from '@/integrations/supabase/types';

type Aircraft = Tables<'aircraft'>;

export default function Aircraft() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [readinessFilter, setReadinessFilter] = useState<string>('all');
  const [aogFilter, setAogFilter] = useState<string>('all');
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchAircraft();
  }, []);

  const fetchAircraft = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('aircraft')
        .select('*')
        .order('registration');

      if (error) throw error;
      setAircraft(data || []);
    } catch (error) {
      console.error('Error fetching aircraft:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAircraft = useMemo(() => {
    return aircraft.filter((ac) => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        ac.registration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ac.fleet_type && ac.fleet_type.toLowerCase().includes(searchQuery.toLowerCase()));

      // Readiness filter
      const matchesReadiness = readinessFilter === 'all' || ac.readiness_status === readinessFilter;

      // AOG filter
      const matchesAog = aogFilter === 'all' || 
        (aogFilter === 'aog' && ac.is_aog) ||
        (aogFilter === 'not_aog' && !ac.is_aog);

      return matchesSearch && matchesReadiness && matchesAog;
    });
  }, [aircraft, searchQuery, readinessFilter, aogFilter]);

  const handleRowClick = (ac: Aircraft) => {
    // Navigate to aircraft profile instead of opening drawer
    window.location.href = `/aircraft/${ac.id}`;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Aircraft Management</h1>
          <p className="text-muted-foreground">
            Manage your fleet and monitor aircraft status
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin mr-2 h-8 w-8" />
          <span className="text-muted-foreground">Loading aircraft...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Aircraft Management</h1>
        <p className="text-muted-foreground">
          Manage your fleet and monitor aircraft status
        </p>
      </div>

      <FleetSummaryBar aircraft={aircraft} />

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by registration or fleet type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={readinessFilter} onValueChange={setReadinessFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Readiness" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Readiness</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="in_maintenance">In Maintenance</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={aogFilter} onValueChange={setAogFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="AOG Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Aircraft</SelectItem>
              <SelectItem value="aog">AOG Only</SelectItem>
              <SelectItem value="not_aog">Not AOG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredAircraft.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No aircraft found matching your filters.
          </div>
        ) : (
          <AircraftTable aircraft={filteredAircraft} onRowClick={handleRowClick} />
        )}
      </div>

      <AircraftDrawer
        aircraft={selectedAircraft}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
