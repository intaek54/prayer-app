import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Admin from './Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 주소로 들어오면 일반 기도함 화면(Home)을 보여줌 */}
        <Route path="/" element={<Home />} />
        
        {/* 주소 뒤에 /admin 을 치고 들어오면 관리자 화면(Admin)을 보여줌 */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;