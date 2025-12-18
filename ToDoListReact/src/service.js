import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL;
//fetch(`${API_URL}/api/todos`)
//fetch('http://localhost:3001/api/todos')

axios.defaults.baseURL = `${API_URL}`;

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
