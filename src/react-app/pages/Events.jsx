import { useState, useEffect } from "react";
import { Calendar, Filter, Sparkles, MapPin, Clock, Users } from "lucide-react";
import Navigation from "../components/Navigation";
import { eventsData as defaultEventsData } from "../data/events";
import { getAllEvents, initializeDefaultData } from "../utils/db";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [categoryFilter, formatFilter, events]);

  const loadEvents = async () => {
    try {
      await initializeDefaultData([], defaultEventsData);
      const data = await getAllEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    if (categoryFilter !== "all") {
      filtered = filtered.filter((e) => e.category === categoryFilter);
    }

    if (formatFilter !== "all") {
      if (formatFilter === "virtual") {
        filtered = filtered.filter((e) => e.isVirtual === true);
      } else if (formatFilter === "in-person") {
        filtered = filtered.filter((e) => e.isVirtual === false);
      }
    }

    setFilteredEvents(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const upcomingEvents = filteredEvents.filter(e => new Date(e.date) >= new Date()).length;

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
                GITAM Alumni Events
              </h1>
              <p className="text-gray-600">
                Connect, learn, and grow with your fellow GITAM alumni
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span className="text-lg font-semibold text-indigo-600">{upcomingEvents} Upcoming</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Categories</option>
                <option value="networking">Networking</option>
                <option value="workshop">Workshop</option>
                <option value="career">Career Development</option>
                <option value="social">Social</option>
                <option value="reunion">Reunion</option>
              </select>
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer transition-all"
              >
                <option value="all">All Formats</option>
                <option value="in-person">In-Person</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
          </div>
        </div>
        
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center text-center py-12">
              <Calendar className="h-24 w-24 text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No events found</h3>
              <p className="text-gray-500">
                Try adjusting your filters to see more events
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    {event.isVirtual ? (
                      <span className="bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Virtual
                      </span>
                    ) : (
                      <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        In-Person
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                      {event.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 text-indigo-600 mr-3" />
                      <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 text-indigo-600 mr-3" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <Users className="h-5 w-5 text-indigo-600 mr-3" />
                      <span>{event.registeredCount} / {event.capacity} registered</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Organized by {event.organizer}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all"
                            style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-medium">
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
