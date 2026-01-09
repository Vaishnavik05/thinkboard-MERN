import React from 'react'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://collaborative-canvas1.onrender.com/api',
});

export default api;
