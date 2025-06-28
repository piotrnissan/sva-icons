import React, { useState, useEffect } from 'react'
import IconExplorer from './components/IconExplorer'
import UsageExamples from './components/UsageExamples'
import V2Features from './components/V2Features'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('explorer')

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="title">SVA Icons v2.0</h1>
          <p className="subtitle">Modern, multi-platform icon system with smart bundles, themes, and enhanced React components</p>
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
          <button 
            className={`nav-button ${activeTab === 'v2-features' ? 'active' : ''}`}
            onClick={() => setActiveTab('v2-features')}
          >
            v2.0 Features
          </button>
        </div>
      </nav>

      <main className="main">
        <div className="container">
          {activeTab === 'explorer' && <IconExplorer />}
          {activeTab === 'usage' && <UsageExamples />}
          {activeTab === 'v2-features' && <V2Features />}
        </div>
      </main>
    </div>
  )
}

export default App
