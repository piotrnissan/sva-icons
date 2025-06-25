import React, { useState, useEffect } from 'react'
import IconExplorer from './components/IconExplorer'
import UsageExamples from './components/UsageExamples'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('explorer')

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="title">SVA Icons</h1>
          <p className="subtitle">Modern, multi-platform icon system with React, Web Components, and more</p>
        </div>
      </header>

      <nav className="nav">
        <div className="container">
          <button 
            className={`nav-button ${activeTab === 'explorer' ? 'active' : ''}`}
            onClick={() => setActiveTab('explorer')}
          >
            Icon Explorer
          </button>
          <button 
            className={`nav-button ${activeTab === 'usage' ? 'active' : ''}`}
            onClick={() => setActiveTab('usage')}
          >
            Usage Examples
          </button>
        </div>
      </nav>

      <main className="main">
        <div className="container">
          {activeTab === 'explorer' && <IconExplorer />}
          {activeTab === 'usage' && <UsageExamples />}
        </div>
      </main>
    </div>
  )
}

export default App
