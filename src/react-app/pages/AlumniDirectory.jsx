import { useState, useEffect } from "react";
import { Search, Filter, TrendingUp } from "lucide-react";
import Navigation from "../components/Navigation";
import { alumniData as defaultAlumniData } from "../data/alumni";
import { getAllAlumni, initializeDefaultData } from "../utils/db";

export default function AlumniDirectory() {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [majorFilter, setMajorFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlumni();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, yearFilter, majorFilter, alumni]);

  const loadAlumni = async () => {
    try {
      await initializeDefaultData(defaultAlumniData, []);
      const data = await getAllAlumni();
      setAlumni(data);
      setFilteredAlumni(data);
    } catch (error) {
      console.error('Error loading alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...alumni];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.company.toLowerCase().includes(query) ||
          a.currentPosition.toLowerCase().includes(query) ||
          a.major.toLowerCase().includes(query)
      );
    }

    if (yearFilter !== "all") {
      filtered = filtered.filter((a) => a.graduationYear === parseInt(yearFilter));
    }

    if (majorFilter !== "all") {
      filtered = filtered.filter((a) => a.major === majorFilter);
    }

    setFilteredAlumni(filtered);
  };

  const graduationYears = [...new Set(alumni.map((a) => a.graduationYear))].sort((a, b) => b - a);
  const majors = [...new Set(alumni.map((a) => a.major))].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                GITAM Alumni Directory
              </h1>
              <p className="text-gray-600">
                Connect with {alumni.length} accomplished graduates from Ganga Institute of Technology and Management
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-lg font-semibold text-indigo-600">{filteredAlumni.length} Alumni</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search alumni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Graduation Years</option>
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={majorFilter}
                onChange={(e) => setMajorFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Majors</option>
                {majors.map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredAlumni.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center text-center py-12">
              <Search className="h-24 w-24 text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No alumni found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filters to find alumni
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                  <img
                    src={person.profileImage}
                    alt={person.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
                  />
                </div>
                <div className="pt-20 px-6 pb-6">
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                    {person.name}
                  </h3>
                  <p className="text-indigo-600 font-medium text-center mb-1">
                    {person.currentPosition}
                  </p>
                  <p className="text-gray-600 text-center mb-4">{person.company}</p>
                  
                  <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Graduation</span>
                      <span className="font-medium text-gray-900">{person.graduationYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Degree</span>
                      <span className="font-medium text-gray-900">{person.degree}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Major</span>
                      <span className="font-medium text-gray-900">{person.major}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location</span>
                      <span className="font-medium text-gray-900">{person.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-4 line-clamp-3">{person.bio}</p>
                  
                  {person.achievements && person.achievements.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">KEY ACHIEVEMENTS</p>
                      <div className="flex flex-wrap gap-2">
                        {person.achievements.slice(0, 2).map((achievement, index) => (
                          <span
                            key={index}
                            className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
