import Sidebar from "@/components/Sidebar";

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gov-bg text-white pl-64">
            <Sidebar />
            <main className="p-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
