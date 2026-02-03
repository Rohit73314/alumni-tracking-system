import { useState, useEffect } from "react";
import { Users, Calendar, Plus, UserPlus, X } from "lucide-react";
import Navigation from "../components/Navigation";
import { getAllAlumni, getAllEvents, addAlumni, addEvent, deleteAlumni, deleteEvent } from "../utils/db";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("alumni");
  const [alumni, setAlumni] = useState([]);
  const [events, setEvents] = useState([]);
  const [showAlumniForm, setShowAlumniForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [alumniForm, setAlumniForm] = useState({
    name: '',
    graduationYear: new Date().getFullYear(),
    degree: 'B.Tech',
    major: 'Computer Science',
    currentPosition: '',
    company: '',
    location: '',
    email: '',
    phone: '',
    bio: '',
    linkedIn: '',
    achievements: '',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'networking',
    capacity: 100,
    registeredCount: 0,
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
    organizer: '',
    isVirtual: false,
    meetingLink: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const alumniData = await getAllAlumni();
      const eventsData = await getAllEvents();
      setAlumni(alumniData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAlumniSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAlumni = {
        id: Date.now().toString(),
        ...alumniForm,
        graduationYear: parseInt(alumniForm.graduationYear),
        achievements: alumniForm.achievements.split(',').map(a => a.trim()).filter(a => a)
      };
      
      await addAlumni(newAlumni);
      await loadData();
      setShowAlumniForm(false);
      resetAlumniForm();
    } catch (error) {
      console.error('Error adding alumni:', error);
      alert('Error adding alumni. Please try again.');
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEvent = {
        id: Date.now().toString(),
        ...eventForm,
        capacity: parseInt(eventForm.capacity),
        registeredCount: parseInt(eventForm.registeredCount),
        isVirtual: eventForm.isVirtual === 'true' || eventForm.isVirtual === true
      };
      
      await addEvent(newEvent);
      await loadData();
      setShowEventForm(false);
      resetEventForm();
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event. Please try again.');
    }
  };

  const handleDeleteAlumni = async (id) => {
    if (confirm('Are you sure you want to delete this alumni?')) {
      try {
        await deleteAlumni(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting alumni:', error);
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const resetAlumniForm = () => {
    setAlumniForm({
      name: '',
      graduationYear: new Date().getFullYear(),
      degree: 'B.Tech',
      major: 'Computer Science',
      currentPosition: '',
      company: '',
      location: '',
      email: '',
      phone: '',
      bio: '',
      linkedIn: '',
      achievements: '',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
    });
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'networking',
      capacity: 100,
      registeredCount: 0,
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
      organizer: '',
      isVirtual: false,
      meetingLink: ''
    });
  };

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            GITAM Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage alumni profiles and events for Ganga Institute of Technology and Management
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("alumni")}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all ${
                  activeTab === "alumni"
                    ? "border-indigo-600 text-indigo-600 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Alumni Management</span>
              </button>
              
              <button
                onClick={() => setActiveTab("events")}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all ${
                  activeTab === "events"
                    ? "border-indigo-600 text-indigo-600 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Event Management</span>
              </button>
            </div>
          </div>
          
          <div className="p-8">
            {activeTab === "alumni" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Alumni Profiles ({alumni.length})</h2>
                  <button
                    onClick={() => setShowAlumniForm(!showAlumniForm)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all"
                  >
                    {showAlumniForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    <span>{showAlumniForm ? 'Cancel' : 'Add Alumni'}</span>
                  </button>
                </div>
                
                {showAlumniForm && (
                  <form onSubmit={handleAlumniSubmit} className="bg-indigo-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Add New Alumni</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        required
                        value={alumniForm.name}
                        onChange={(e) => setAlumniForm({...alumniForm, name: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Graduation Year *"
                        required
                        value={alumniForm.graduationYear}
                        onChange={(e) => setAlumniForm({...alumniForm, graduationYear: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <select
                        value={alumniForm.degree}
                        onChange={(e) => setAlumniForm({...alumniForm, degree: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option>B.Tech</option>
                        <option>MBA</option>
                        <option>M.Tech</option>
                        <option>B.Des</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Major *"
                        required
                        value={alumniForm.major}
                        onChange={(e) => setAlumniForm({...alumniForm, major: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Current Position *"
                        required
                        value={alumniForm.currentPosition}
                        onChange={(e) => setAlumniForm({...alumniForm, currentPosition: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Company *"
                        required
                        value={alumniForm.company}
                        onChange={(e) => setAlumniForm({...alumniForm, company: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Location *"
                        required
                        value={alumniForm.location}
                        onChange={(e) => setAlumniForm({...alumniForm, location: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        placeholder="Email *"
                        required
                        value={alumniForm.email}
                        onChange={(e) => setAlumniForm({...alumniForm, email: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={alumniForm.phone}
                        onChange={(e) => setAlumniForm({...alumniForm, phone: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="LinkedIn URL"
                        value={alumniForm.linkedIn}
                        onChange={(e) => setAlumniForm({...alumniForm, linkedIn: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="Profile Image URL"
                        value={alumniForm.profileImage}
                        onChange={(e) => setAlumniForm({...alumniForm, profileImage: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:col-span-2"
                      />
                      <textarea
                        placeholder="Bio *"
                        required
                        rows="3"
                        value={alumniForm.bio}
                        onChange={(e) => setAlumniForm({...alumniForm, bio: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Achievements (comma-separated)"
                        value={alumniForm.achievements}
                        onChange={(e) => setAlumniForm({...alumniForm, achievements: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:col-span-2"
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all"
                    >
                      Save Alumni
                    </button>
                  </form>
                )}
                
                {alumni.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <UserPlus className="h-24 w-24 text-gray-300 mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">No alumni profiles yet</h3>
                    <p className="text-gray-500">Click "Add Alumni" to create your first profile</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {alumni.map((person) => (
                      <div key={person.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <img
                            src={person.profileImage}
                            alt={person.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <button
                            onClick={() => handleDeleteAlumni(person.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <h4 className="font-semibold text-lg">{person.name}</h4>
                        <p className="text-sm text-indigo-600">{person.currentPosition}</p>
                        <p className="text-sm text-gray-600">{person.company}</p>
                        <p className="text-xs text-gray-500 mt-2">{person.graduationYear} • {person.major}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "events" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Events ({events.length})</h2>
                  <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all"
                  >
                    {showEventForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    <span>{showEventForm ? 'Cancel' : 'Create Event'}</span>
                  </button>
                </div>
                
                {showEventForm && (
                  <form onSubmit={handleEventSubmit} className="bg-indigo-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Event Title *"
                        required
                        value={eventForm.title}
                        onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:col-span-2"
                      />
                      <textarea
                        placeholder="Description *"
                        required
                        rows="3"
                        value={eventForm.description}
                        onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:col-span-2"
                      />
                      <input
                        type="date"
                        required
                        value={eventForm.date}
                        onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="time"
                        required
                        value={eventForm.time}
                        onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Location *"
                        required
                        value={eventForm.location}
                        onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <select
                        value={eventForm.category}
                        onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="networking">Networking</option>
                        <option value="workshop">Workshop</option>
                        <option value="career">Career</option>
                        <option value="social">Social</option>
                        <option value="reunion">Reunion</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Capacity *"
                        required
                        value={eventForm.capacity}
                        onChange={(e) => setEventForm({...eventForm, capacity: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Organizer *"
                        required
                        value={eventForm.organizer}
                        onChange={(e) => setEventForm({...eventForm, organizer: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <select
                        value={eventForm.isVirtual}
                        onChange={(e) => setEventForm({...eventForm, isVirtual: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value={false}>In-Person</option>
                        <option value={true}>Virtual</option>
                      </select>
                      <input
                        type="url"
                        placeholder="Meeting Link (if virtual)"
                        value={eventForm.meetingLink}
                        onChange={(e) => setEventForm({...eventForm, meetingLink: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="Event Image URL"
                        value={eventForm.imageUrl}
                        onChange={(e) => setEventForm({...eventForm, imageUrl: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:col-span-2"
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all"
                    >
                      Create Event
                    </button>
                  </form>
                )}
                
                {events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <Calendar className="h-24 w-24 text-gray-300 mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">No events yet</h3>
                    <p className="text-gray-500">Click "Create Event" to schedule your first event</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map((event) => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{event.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-500">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            {event.date} at {event.time}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            Category: {event.category} • {event.isVirtual ? 'Virtual' : 'In-Person'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {event.registeredCount} / {event.capacity} registered
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
