import Sidebar from "@/components/Sidebar";

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gov-bg text-white md:pl-64">
            <Sidebar />
            <main className="p-4 md:p-8 max-w-7xl mx-auto pt-16 md:pt-8">
                {children}
            </main>
        </div>
    );
}
