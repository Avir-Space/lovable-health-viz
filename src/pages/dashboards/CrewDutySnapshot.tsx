import { KpiCard } from '@/components/kpi/KpiCard';

export default function CrewDutySnapshot() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Crew & Duty Snapshot</h1>
        <p className="text-muted-foreground">
          Monitor crew availability, duty hours, and scheduling compliance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <KpiCard kpiKey="crew-duty-snapshot:crew_availability" title="Crew Availability" variant="gauge" />
        <KpiCard kpiKey="crew-duty-snapshot:duty_hours_by_crew" title="Duty Hours by Crew" variant="bar" />
        <KpiCard kpiKey="crew-duty-snapshot:scheduling_compliance" title="Scheduling Compliance" variant="line" />
        <KpiCard kpiKey="crew-duty-snapshot:crew_certifications_expiring" title="Crew Certifications Expiring" variant="table" />
      </div>
    </div>
  );
}
