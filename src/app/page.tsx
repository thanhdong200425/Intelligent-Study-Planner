import { TimeIcon, BookIcon, ChartBarIcon } from "@/components/icons/Icons";
import { StatCard, TasksProgressChart, ProductivityChart, InterestChart, Schedule, Assignments, SidebarNav, HeaderBar } from "@/components";


export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard icon={<TimeIcon />} title="Hours Spent" value="54 hours" bgColor="bg-yellow-100" iconColor="text-yellow-500" />
                <StatCard icon={<BookIcon />} title="Courses" value="02" bgColor="bg-green-100" iconColor="text-green-500" />
                <StatCard icon={<ChartBarIcon />} title="Test Results" value="82%" bgColor="bg-blue-100" iconColor="text-blue-500" />
              </div>

              <TasksProgressChart />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InterestChart />
                <ProductivityChart />
              </div>
            </div>

            {/* Right sidebar content */}
            <div className="lg:col-span-1 space-y-6">
              <Schedule />
              <Assignments />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
