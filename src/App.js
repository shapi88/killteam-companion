import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import ShootingForm from './components/ShootingForm';
import Home from './components/Home';
import PDFViewer from './components/PDFViewer';
import WeaponRules from './components/WeaponRules';
import GameSetup from './components/GameSetup';
import UniversalEquipments from './components/UniversalEquipments';
import teamData from './team_rules.json';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ width: '256px', backgroundColor: '#1f2937', color: 'white', minHeight: '100%', padding: '1rem' }}>
          <SideMenu />
        </div>
        <Container style={{ padding: '1rem', flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/calculator" element={<ShootingForm teamData={teamData} />} />
            <Route path="/home" element={<Home />} />
            <Route path="/pdf-viewer" element={<PDFViewer />} />
            <Route path="/weapon-rules" element={<WeaponRules />} />
            <Route path="/game-setup" element={<GameSetup />} />
            <Route path="/universal-equipments" element={<UniversalEquipments />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;