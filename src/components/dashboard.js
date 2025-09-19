import React, { useState, useEffect } from 'react';
import { Search, Plus, X, MoreHorizontal, RefreshCw, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './dashboard.css';

const DynamicDashboard = () => {
  // Initial dashboard configuration matching the images
  const initialDashboard = {
    categories: [
      {
        id: 'cspm',
        name: 'CSPM Executive Dashboard',
        widgets: [
          {
            id: 'cloud-accounts',
            name: 'Cloud Accounts',
            type: 'donut',
            data: [
              { name: 'Connected', value: 2, color: '#3B82F6' },
              { name: 'Not Connected', value: 2, color: '#E5E7EB' }
            ],
            total: 2,
            isActive: true
          },
          {
            id: 'cloud-risk',
            name: 'Cloud Account Risk Assessment',
            type: 'donut',
            data: [
              { name: 'Failed', value: 1689, color: '#EF4444' },
              { name: 'Warning', value: 681, color: '#F59E0B' },
              { name: 'Not available', value: 36, color: '#9CA3AF' },
              { name: 'Passed', value: 7253, color: '#10B981' }
            ],
            total: 9659,
            isActive: true
          }
        ]
      },
      {
        id: 'cwpp',
        name: 'CWPP Dashboard',
        widgets: [
          {
            id: 'top-alerts',
            name: 'Top 5 Namespace Specific Alerts',
            type: 'empty',
            text: 'No Graph data available!',
            isActive: true
          },
          {
            id: 'workload-alerts',
            name: 'Workload Alerts',
            type: 'empty',
            text: 'No Graph data available!',
            isActive: true
          }
        ]
      },
      {
        id: 'registry',
        name: 'Registry Scan',
        widgets: [
          {
            id: 'image-risk',
            name: 'Image Risk Assessment',
            type: 'progress',
            total: 1470,
            subtitle: 'Total Vulnerabilities',
            data: [
              { name: 'Critical', value: 9, color: '#DC2626' },
              { name: 'High', value: 150, color: '#EA580C' }
            ],
            isActive: true
          },
          {
            id: 'image-security',
            name: 'Image Security Issues',
            type: 'progress',
            total: 2,
            subtitle: 'Total Images',
            data: [
              { name: 'Critical', value: 2, color: '#DC2626' },
              { name: 'High', value: 2, color: '#EA580C' }
            ],
            isActive: true
          }
        ]
      }
    ]
  };

  // Available widgets for each tab that can be added
  const availableWidgets = {
    CSPM: [
      {
        id: 'cloud-compliance',
        name: 'Cloud Compliance Status',
        type: 'donut',
        data: [
          { name: 'Compliant', value: 75, color: '#10B981' },
          { name: 'Non-Compliant', value: 25, color: '#EF4444' }
        ],
        total: 100,
        isActive: false
      },
      {
        id: 'resource-inventory',
        name: 'Resource Inventory',
        type: 'donut',
        data: [
          { name: 'EC2', value: 40, color: '#3B82F6' },
          { name: 'S3', value: 30, color: '#8B5CF6' },
          { name: 'RDS', value: 20, color: '#F59E0B' },
          { name: 'Lambda', value: 10, color: '#EC4899' }
        ],
        total: 100,
        isActive: false
      }
    ],
    CWPP: [
      {
        id: 'container-security',
        name: 'Container Security Posture',
        type: 'progress',
        total: 100,
        subtitle: 'Security Score',
        data: [
          { name: 'Secure', value: 85, color: '#10B981' },
          { name: 'Needs Attention', value: 15, color: '#F59E0B' }
        ],
        isActive: false
      },
      {
        id: 'runtime-alerts',
        name: 'Runtime Alerts Trend',
        type: 'empty',
        text: 'No Graph data available!',
        isActive: false
      }
    ],
    Image: [
      {
        id: 'vulnerability-trend',
        name: 'Vulnerability Trend Over Time',
        type: 'empty',
        text: 'No Graph data available!',
        isActive: false
      },
      {
        id: 'image-compliance',
        name: 'Image Compliance Status',
        type: 'donut',
        data: [
          { name: 'Compliant', value: 60, color: '#10B981' },
          { name: 'Non-Compliant', value: 40, color: '#EF4444' }
        ],
        total: 100,
        isActive: false
      }
    ],
    Ticket: [
      {
        id: 'ticket-status',
        name: 'Ticket Status Overview',
        type: 'donut',
        data: [
          { name: 'Open', value: 30, color: '#3B82F6' },
          { name: 'In Progress', value: 25, color: '#F59E0B' },
          { name: 'Resolved', value: 45, color: '#10B981' }
        ],
        total: 100,
        isActive: false
      },
      {
        id: 'ticket-trend',
        name: 'Ticket Trend Analysis',
        type: 'empty',
        text: 'No Graph data available!',
        isActive: false
      }
    ]
  };

  // Create initial selectedWidgets state - ALL WIDGETS CHECKED
  const getInitialSelectedWidgets = () => {
    const widgetStates = {};
    initialDashboard.categories.forEach(category => {
      category.widgets.forEach(widget => {
        widgetStates[widget.id] = true; // Set all widgets to checked
      });
    });
    
    // Also include available widgets
    Object.values(availableWidgets).forEach(widgets => {
      widgets.forEach(widget => {
        widgetStates[widget.id] = false; // Set available widgets to unchecked by default
      });
    });
    
    return widgetStates;
  };

  const [dashboard, setDashboard] = useState(initialDashboard);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('CSPM');
  const [selectedWidgets, setSelectedWidgets] = useState(getInitialSelectedWidgets());

  const tabs = ['CSPM', 'CWPP', 'Image', 'Ticket'];

  // Map category IDs to tab names
  const categoryToTabMap = {
    'cspm': 'CSPM',
    'cwpp': 'CWPP',
    'registry': 'Image'
  };

  // Map tab names to category IDs
  const tabToCategoryMap = {
    'CSPM': 'cspm',
    'CWPP': 'cwpp',
    'Image': 'registry',
    'Ticket': 'ticket'
  };

  // Get all widgets from the dashboard
  const getAllWidgets = () => {
    const allWidgets = [];
    dashboard.categories.forEach(category => {
      category.widgets.forEach(widget => {
        allWidgets.push({
          id: widget.id,
          name: widget.name,
          category: category.id,
          isActive: widget.isActive
        });
      });
    });
    return allWidgets;
  };

  // Get widgets for each tab (both existing and available)
  const getTabWidgets = (tab) => {
    const categoryId = tabToCategoryMap[tab];
    if (!categoryId && tab !== 'Ticket') return [];
    
    // Get existing widgets for this tab/category
    const existingWidgets = getAllWidgets().filter(widget => 
      widget.category === categoryId
    );
    
    // Get available widgets for this tab
    const availableTabWidgets = availableWidgets[tab] || [];
    
    // Combine and remove duplicates
    const allWidgets = [...existingWidgets];
    
    availableTabWidgets.forEach(availableWidget => {
      if (!allWidgets.some(w => w.id === availableWidget.id)) {
        allWidgets.push({
          id: availableWidget.id,
          name: availableWidget.name,
          category: categoryId,
          isActive: false
        });
      }
    });
    
    return allWidgets;
  };

  // Handle opening the add widget modal with the correct tab
  const handleAddWidgetClick = (categoryId) => {
    const tabName = categoryToTabMap[categoryId];
    if (tabName) {
      setActiveTab(tabName);
    }
    setShowAddWidget(true);
  };

  // DonutChart Component
  const DonutChart = ({ data, total }) => (
    <div className="donut-container">
      <div className="donut-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={25}
              outerRadius={45}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <div className="donut-total">{total}</div>
          <div className="donut-label">Total</div>
        </div>
      </div>
      <div className="donut-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color"
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-text">{item.name} ({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ProgressBar Component
  const ProgressBar = ({ data, total, subtitle }) => {
    return (
      <div>
        <div className="progress-header">
          <div className="progress-total">{total}</div>
          <div className="progress-subtitle">{subtitle}</div>
        </div>
        <div className="progress-bar-container">
          {data.map((item, index) => (
            <div
              key={index}
              className="progress-bar-segment"
              style={{
                backgroundColor: item.color,
                width: `${(item.value / total) * 100}%`
              }}
            />
          ))}
        </div>
        <div className="progress-legend">
          {data.map((item, index) => (
            <div key={index} className="progress-legend-item">
              <div 
                className="progress-legend-color"
                style={{ backgroundColor: item.color }}
              />
              <span className="progress-legend-text">{item.name} ({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Empty Widget Component
  const EmptyWidget = ({ text }) => (
    <div className="empty-widget">
      <div className="empty-icon">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="5" y="25" width="6" height="10" fill="currentColor" opacity="0.3"/>
          <rect x="13" y="20" width="6" height="15" fill="currentColor" opacity="0.5"/>
          <rect x="21" y="15" width="6" height="20" fill="currentColor" opacity="0.7"/>
          <rect x="29" y="10" width="6" height="25" fill="currentColor"/>
        </svg>
      </div>
      <div className="empty-text">{text}</div>
    </div>
  );

  // Handle widget toggle in modal
  const handleWidgetToggle = (widgetId, checked) => {
    setSelectedWidgets(prev => ({
      ...prev,
      [widgetId]: checked
    }));
  };

  // Get widget data by ID
  const getWidgetData = (widgetId) => {
    // Check available widgets first
    for (const tab of Object.keys(availableWidgets)) {
      const widget = availableWidgets[tab].find(w => w.id === widgetId);
      if (widget) return widget;
    }
    
    // Check existing widgets
    for (const category of dashboard.categories) {
      const widget = category.widgets.find(w => w.id === widgetId);
      if (widget) return widget;
    }
    
    return null;
  };

  // Confirm widget selection
  const handleConfirmSelection = () => {
    const updatedCategories = [...dashboard.categories];
    
    // Process each widget selection
    Object.entries(selectedWidgets).forEach(([widgetId, isSelected]) => {
      const widgetData = getWidgetData(widgetId);
      if (!widgetData) return;
      
      // Determine which category this widget belongs to
      let categoryId = null;
      for (const category of updatedCategories) {
        if (category.widgets.some(w => w.id === widgetId)) {
          categoryId = category.id;
          break;
        }
      }
      
      // If not found in existing categories, determine based on tab
      if (!categoryId) {
        for (const [tab, widgets] of Object.entries(availableWidgets)) {
          if (widgets.some(w => w.id === widgetId)) {
            categoryId = tabToCategoryMap[tab];
            break;
          }
        }
      }
      
      if (!categoryId) return;
      
      // Find the category
      const categoryIndex = updatedCategories.findIndex(c => c.id === categoryId);
      if (categoryIndex === -1) return;
      
      // Check if widget already exists in the category
      const widgetIndex = updatedCategories[categoryIndex].widgets.findIndex(w => w.id === widgetId);
      
      if (widgetIndex !== -1) {
        // Update existing widget
        updatedCategories[categoryIndex].widgets[widgetIndex].isActive = isSelected;
      } else if (isSelected) {
        // Add new widget
        updatedCategories[categoryIndex].widgets.push({
          ...widgetData,
          isActive: true
        });
      }
    });
    
    // Update the dashboard
    setDashboard(prev => ({
      ...prev,
      categories: updatedCategories
    }));
    
    setShowAddWidget(false);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator"> &gt; </span>
            <span className="breadcrumb-active">Dashboard V2</span>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="icon-button">
              <RefreshCw size={16} />
            </button>
            <button className="icon-button">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">CNAPP Dashboard</h1>
          <div className="dashboard-actions">
            <button
              onClick={() => {
                setActiveTab('CSPM');
                setShowAddWidget(true);
              }}
              className="add-widget-button"
            >
              <span>Add Widget</span>
              <Plus size={16} />
            </button>
            <button className="icon-button">
              <RefreshCw size={16} />
            </button>
            <button className="icon-button">
              <MoreHorizontal size={16} />
            </button>
            <div className="time-selector">
              <Clock size={16} />
              <span className="time-selector-text">Last 2 days</span>
              <svg className="time-selector-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Dashboard Categories */}
        <div className="categories-container">
          {dashboard.categories.map(category => {
            const activeWidgets = category.widgets.filter(w => w.isActive);
            
            return (
              <div key={category.id} className="category-card">
                <div className="category-header">
                  <h2 className="category-title">{category.name}</h2>
                </div>
                <div className="category-content">
                  <div className="widgets-grid">
                    {activeWidgets.map(widget => (
                      <div key={widget.id} className="widget-card">
                        <div className="widget-header">
                          <h3 className="widget-title">{widget.name}</h3>
                        </div>
                        <div className="widget-content">
                          {widget.type === 'donut' && (
                            <DonutChart data={widget.data} total={widget.total} />
                          )}
                          {widget.type === 'progress' && (
                            <ProgressBar data={widget.data} total={widget.total} subtitle={widget.subtitle} />
                          )}
                          {widget.type === 'empty' && (
                            <EmptyWidget text={widget.text} />
                          )}
                        </div>
                      </div>
                    ))}
                    {/* Add Widget Button */}
                    <button
                      onClick={() => handleAddWidgetClick(category.id)}
                      className="add-widget-card"
                    >
                      <Plus size={24} className="add-widget-icon" />
                      <span className="add-widget-text">Add Widget</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="modal-overlay">
          <div className="modal">
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title">Add Widget</h2>
              <button
                onClick={() => setShowAddWidget(false)}
                className="modal-close-button"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="modal-content">
              <p className="modal-description">
                Personalise your dashboard by adding the following widget
              </p>

              {/* Tabs */}
              <div className="tabs-container">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`tab ${activeTab === tab ? 'active-tab' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Widget List */}
              <div className="widget-list">
                {getTabWidgets(activeTab).map(widget => (
                  <label key={widget.id} className="widget-list-item">
                    <input
                      type="checkbox"
                      checked={selectedWidgets[widget.id] || false}
                      onChange={(e) => handleWidgetToggle(widget.id, e.target.checked)}
                      className="checkbox"
                    />
                    <span className="widget-list-text">{widget.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                onClick={() => setShowAddWidget(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                className="confirm-button"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicDashboard;