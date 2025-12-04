import axios from 'axios';

axios.defaults.baseURL = "http://localhost:5093"

// הוספת interceptor לתפיסת שגיאות
axios.interceptors.response.use(
  response => response, // במקרה של הצלחה, מחזירים את ה-response
  error => {
    console.error('Error in response:', error); // רושמים את השגיאה ללוג
    return Promise.reject(error); // דוחים את השגיאה הלאה
  }
);

export default {
  getTasks: async () => {
    const result = await axios.get('/items');
    return result.data;
  },

  addTask: async (name) => {
    const result = await axios.post('/items', { name });
    return result.data;
  },

  setCompleted: async (id, name, isComplete) => {
    const result = await axios.put(`/items/${id}`, { 
      name, 
      isComplete: isComplete ? 1 : 0 
    });
    return result.data;
  },

  deleteTask: async (id) => {
    const result = await axios.delete(`/items/${id}`);
    return result.data;
  }
};
