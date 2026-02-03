const DB_NAME = 'AlumniTrackingDB';
const DB_VERSION = 1;
const ALUMNI_STORE = 'alumni';
const EVENTS_STORE = 'events';

let db = null;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      if (!database.objectStoreNames.contains(ALUMNI_STORE)) {
        database.createObjectStore(ALUMNI_STORE, { keyPath: 'id' });
      }

      if (!database.objectStoreNames.contains(EVENTS_STORE)) {
        database.createObjectStore(EVENTS_STORE, { keyPath: 'id' });
      }
    };
  });
};

export const getAllAlumni = async () => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([ALUMNI_STORE], 'readonly');
    const store = transaction.objectStore(ALUMNI_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addAlumni = async (alumni) => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([ALUMNI_STORE], 'readwrite');
    const store = transaction.objectStore(ALUMNI_STORE);
    const request = store.add(alumni);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const updateAlumni = async (alumni) => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([ALUMNI_STORE], 'readwrite');
    const store = transaction.objectStore(ALUMNI_STORE);
    const request = store.put(alumni);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteAlumni = async (id) => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([ALUMNI_STORE], 'readwrite');
    const store = transaction.objectStore(ALUMNI_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAllEvents = async () => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readonly');
    const store = transaction.objectStore(EVENTS_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addEvent = async (event) => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readwrite');
    const store = transaction.objectStore(EVENTS_STORE);
    const request = store.add(event);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const updateEvent = async (event) => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readwrite');
    const store = transaction.objectStore(EVENTS_STORE);
    const request = store.put(event);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteEvent = async (id) => {
  if (!db) await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readwrite');
    const store = transaction.objectStore(EVENTS_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const initializeDefaultData = async (alumniData, eventsData) => {
  if (!db) await initDB();
  
  const existingAlumni = await getAllAlumni();
  const existingEvents = await getAllEvents();
  
  if (existingAlumni.length === 0) {
    for (const alumni of alumniData) {
      await addAlumni(alumni);
    }
  }
  
  if (existingEvents.length === 0) {
    for (const event of eventsData) {
      await addEvent(event);
    }
  }
};
