import {
  FileText,
  Upload,
  Clock,
  CheckCircle,
  Trash2,
  Search,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 min-h-screen text-white p-6 bg-[#1D232A]">
      {/* Recent Documents - Takes More Space in the Middle */}
      <div className="col-span-12 md:col-span-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Recent Documents</h2>
          <ul className="space-y-3">
            {[
              {
                name: "Project Proposal.pdf",
                uploadedBy: "John",
                date: "Jan 18, 2025",
              },
              {
                name: "Financial Report.xlsx",
                uploadedBy: "Jane",
                date: "Jan 17, 2025",
              },
              {
                name: "HR Policies.docx",
                uploadedBy: "Mike",
                date: "Jan 16, 2025",
              },
            ].map((doc, index) => (
              <li
                key={index}
                className="flex justify-between p-3 bg-gray-700 rounded"
              >
                <span>
                  {doc.name} (by {doc.uploadedBy})
                </span>
                <span className="text-sm text-gray-400">{doc.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stats Section - Takes Full Width on Mobile, 3 Columns on Desktop */}
      <div className="col-span-12 md:col-span-4">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {[
            {
              title: "Total Documents",
              count: 120,
              icon: <FileText size={20} />,
            },
            {
              title: "Approved Documents",
              count: 85,
              icon: <CheckCircle size={20} />,
            },
            { title: "Pending Review", count: 25, icon: <Clock size={20} /> },
            { title: "Deleted Files", count: 10, icon: <Trash2 size={20} /> },
          ].map((stat, index) => (
            <div
              key={index}
              className="p-4 bg-gray-800 rounded-lg flex items-center space-x-4"
            >
              <div className="text-primary">{stat.icon}</div>
              <div>
                <h3 className="text-md">{stat.title}</h3>
                <p className="text-xl font-bold">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Categories - Smaller Section */}
      <div className="col-span-12 md:col-span-12">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Document Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {["Contracts", "Reports", "Invoices", "Policies"].map(
              (category, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-700 rounded text-center"
                >
                  {category}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
