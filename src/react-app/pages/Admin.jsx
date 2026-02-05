import { useState, useEffect } from "react";
import { Users, Calendar, Plus, UserPlus, X, LogIn } from "lucide-react";
import Navigation from "../components/Navigation";
import { getAllAlumni, getAllEvents, addAlumni, addEvent, deleteAlumni, deleteEvent } from "../utils/db";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("alumni");
  const [alumni, setAlumni] = useState([]);
  const [events, setEvents] = useState([]);
  const [showAlumniForm, setShowAlumniForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Static admin credentials (for demo only - in production use proper auth)
  const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "gitam123",
  };

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    if (
      username.trim().toLowerCase() === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      setLoginError("");
      localStorage.setItem("adminAuthenticated", "true");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  // Check for persisted login
  useEffect(() => {
    const auth = localStorage.getItem("adminAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Load data only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const alumniData = await getAllAlumni();
      const eventsData = await getAllEvents();
      setAlumni(alumniData || []);
      setEvents(eventsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
    setUsername("");
    setPassword("");
    setLoginError("");
  };

  const [alumniForm, setAlumniForm] = useState({
    name: "",
    graduationYear: new Date().getFullYear(),
    degree: "B.Tech",
    major: "Computer Science",
    currentPosition: "",
    company: "",
    location: "",
    email: "",
    phone: "",
    bio: "",
    linkedIn: "",
    achievements: "",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  });

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "networking",
    capacity: 100,
    registeredCount: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop",
    organizer: "",
    isVirtual: false,
    meetingLink: "",
  });

  const handleAlumniSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAlumni = {
        id: Date.now().toString(),
        ...alumniForm,
        graduationYear: parseInt(alumniForm.graduationYear),
        achievements: alumniForm.achievements
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
      };

      await addAlumni(newAlumni);
      await loadData();
      setShowAlumniForm(false);
      resetAlumniForm();
    } catch (error) {
      console.error("Error adding alumni:", error);
      alert("Error adding alumni. Please try again.");
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
        isVirtual: eventForm.isVirtual === "true" || eventForm.isVirtual === true,
      };

      await addEvent(newEvent);
      await loadData();
      setShowEventForm(false);
      resetEventForm();
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error adding event. Please try again.");
    }
  };

  const handleDeleteAlumni = async (id) => {
    if (confirm("Are you sure you want to delete this alumni?")) {
      try {
        await deleteAlumni(id);
        await loadData();
      } catch (error) {
        console.error("Error deleting alumni:", error);
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        await loadData();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const resetAlumniForm = () => {
    setAlumniForm({
      name: "",
      graduationYear: new Date().getFullYear(),
      degree: "B.Tech",
      major: "Computer Science",
      currentPosition: "",
      company: "",
      location: "",
      email: "",
      phone: "",
      bio: "",
      linkedIn: "",
      achievements: "",
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    });
  };

  const resetEventForm = () => {
    setEventForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "networking",
      capacity: 100,
      registeredCount: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop",
      organizer: "",
      isVirtual: false,
      meetingLink: "",
    });
  };

  // ── LOGIN SCREEN ─────────────────────────────────────────────────────────────
  // This is the login portion - when user is NOT authenticated
if (!isAuthenticated) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Navigation bar at the top */}
      <Navigation />

      {/* Main content - centered login form */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              GITAM Admin Login
            </h1>
            <p className="text-gray-600 mt-3 text-sm sm:text-base">
              Sign in to manage alumni profiles and events
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="admin"
                required
                autoFocus
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error message */}
            {loginError && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100">
                {loginError}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

  // ── LOADING STATE ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-gray-600 text-lg">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  // ── MAIN ADMIN PANEL ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                GITAM Admin Panel
              </h1>
              <p className="text-gray-600">
                Manage alumni profiles and events for Ganga Institute of Technology and Management
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("alumni")}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 border-b-2 transition-all ${
                  activeTab === "alumni"
                    ? "border-indigo-600 text-indigo-600 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Alumni</span>
              </button>

              <button
                onClick={() => setActiveTab("events")}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 border-b-2 transition-all ${
                  activeTab === "events"
                    ? "border-indigo-600 text-indigo-600 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Events</span>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Alumni Tab */}
            {activeTab === "alumni" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Alumni Profiles ({alumni.length})
                  </h2>
                  <button
                    onClick={() => setShowAlumniForm(!showAlumniForm)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all shadow-md"
                  >
                    {showAlumniForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    <span>{showAlumniForm ? "Cancel" : "Add Alumni"}</span>
                  </button>
                </div>

                {showAlumniForm && (
                  <form onSubmit={handleAlumniSubmit} className="bg-indigo-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-semibold mb-6 text-indigo-800">Add New Alumni</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        required
                        value={alumniForm.name}
                        onChange={(e) => setAlumniForm({ ...alumniForm, name: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Graduation Year *"
                        required
                        value={alumniForm.graduationYear}
                        onChange={(e) => setAlumniForm({ ...alumniForm, graduationYear: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <select
                        value={alumniForm.degree}
                        onChange={(e) => setAlumniForm({ ...alumniForm, degree: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option>B.Tech</option>
                        <option>M.Tech</option>
                        <option>MBA</option>
                        <option>BBA</option>
                        <option>BCA</option>
                        <option>Others</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Major / Branch *"
                        required
                        value={alumniForm.major}
                        onChange={(e) => setAlumniForm({ ...alumniForm, major: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Current Position *"
                        required
                        value={alumniForm.currentPosition}
                        onChange={(e) => setAlumniForm({ ...alumniForm, currentPosition: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Company / Organization *"
                        required
                        value={alumniForm.company}
                        onChange={(e) => setAlumniForm({ ...alumniForm, company: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Location *"
                        required
                        value={alumniForm.location}
                        onChange={(e) => setAlumniForm({ ...alumniForm, location: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        placeholder="Email Address *"
                        required
                        value={alumniForm.email}
                        onChange={(e) => setAlumniForm({ ...alumniForm, email: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={alumniForm.phone}
                        onChange={(e) => setAlumniForm({ ...alumniForm, phone: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="LinkedIn Profile URL"
                        value={alumniForm.linkedIn}
                        onChange={(e) => setAlumniForm({ ...alumniForm, linkedIn: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="Profile Image URL"
                        value={alumniForm.profileImage}
                        onChange={(e) => setAlumniForm({ ...alumniForm, profileImage: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:col-span-2"
                      />
                      <textarea
                        placeholder="Short Bio *"
                        required
                        rows={3}
                        value={alumniForm.bio}
                        onChange={(e) => setAlumniForm({ ...alumniForm, bio: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Achievements (comma separated)"
                        value={alumniForm.achievements}
                        onChange={(e) => setAlumniForm({ ...alumniForm, achievements: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:col-span-2"
                      />
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all font-medium"
                      >
                        Save Alumni
                      </button>
                    </div>
                  </form>
                )}

                {alumni.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <UserPlus className="h-20 w-20 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No alumni profiles yet</h3>
                    <p className="text-gray-500">Add your first alumni member using the button above</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alumni.map((person) => (
                      <div
                        key={person.id}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <img
                            src={person.profileImage}
                            alt={person.name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop";
                            }}
                          />
                          <button
                            onClick={() => handleDeleteAlumni(person.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                        <h4 className="font-bold text-lg mb-1">{person.name}</h4>
                        <p className="text-indigo-600 font-medium">{person.currentPosition}</p>
                        <p className="text-gray-600">{person.company}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {person.graduationYear} • {person.major}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === "events" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Events ({events.length})
                  </h2>
                  <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:shadow-lg transition-all shadow-md"
                  >
                    {showEventForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    <span>{showEventForm ? "Cancel" : "Create Event"}</span>
                  </button>
                </div>

                {showEventForm && (
                  <form onSubmit={handleEventSubmit} className="bg-indigo-50 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-semibold mb-6 text-indigo-800">Create New Event</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <input
                        type="text"
                        placeholder="Event Title *"
                        required
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:col-span-2"
                      />
                      <textarea
                        placeholder="Description *"
                        required
                        rows={4}
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:col-span-2"
                      />
                      <input
                        type="date"
                        required
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="time"
                        required
                        value={eventForm.time}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Location *"
                        required
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <select
                        value={eventForm.category}
                        onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="networking">Networking</option>
                        <option value="workshop">Workshop</option>
                        <option value="career">Career Guidance</option>
                        <option value="social">Social / Reunion</option>
                        <option value="technical">Technical</option>
                        <option value="other">Other</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Capacity *"
                        required
                        min="1"
                        value={eventForm.capacity}
                        onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Organizer Name *"
                        required
                        value={eventForm.organizer}
                        onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <select
                        value={eventForm.isVirtual}
                        onChange={(e) => setEventForm({ ...eventForm, isVirtual: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value={false}>In-Person</option>
                        <option value={true}>Virtual</option>
                      </select>
                      <input
                        type="url"
                        placeholder="Meeting Link (for virtual events)"
                        value={eventForm.meetingLink}
                        onChange={(e) => setEventForm({ ...eventForm, meetingLink: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <input
                        type="url"
                        placeholder="Event Banner Image URL"
                        value={eventForm.imageUrl}
                        onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:col-span-2"
                      />
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all font-medium"
                      >
                        Create Event
                      </button>
                    </div>
                  </form>
                )}

                {events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <Calendar className="h-20 w-20 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No events scheduled yet</h3>
                    <p className="text-gray-500">Create your first event using the button above</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1">{event.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-500 hover:text-red-700 p-1 ml-2"
                            title="Delete"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>

                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                          <p>
                            <Calendar className="inline h-4 w-4 mr-1" />
                            {event.date} • {event.time}
                          </p>
                          <p className="capitalize">
                            {event.category} • {event.isVirtual ? "Virtual" : "In-Person"}
                          </p>
                          <p className="font-medium text-indigo-600">
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