import { HeaderBar } from '../../components/layout/HeaderBar';
import { SidebarNav } from "../../components/layout/SidebarNav";
import { PlannerCalendar } from "../../components/calendar/PlannerCalendar";
import { UpcomingEvents } from '../../components/panels/UpcomingEvents';
import { StudyGoals } from '../../components/panels/StudyGoals';
import { HabitTracker } from '../../components/habits/HabitTracker';

export default function PlannerPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SidebarNav />
            <main className="flex-1 overflow-hidden flex flex-col min-h-0">
                <HeaderBar />
                <div className="p-8 pt-0 flex-1 min-h-0">
                    <div className="grid grid-cols-12 gap-6 mt-6 h-full min-h-0">
                        <section className="col-span-8 flex min-h-0">
                            <div className="flex-1 min-h-0">
                                <PlannerCalendar />
                            </div>
                        </section>
                        <aside className="col-span-4 space-y-6 overflow-auto">
                            <UpcomingEvents />
                            <StudyGoals />
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}


