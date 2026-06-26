
import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { api } from '../services/api'

export default function FullScheduler() {
  const { fetchAllData, events } = useAppContext()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('month')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [newEvent, setNewEvent] = useState({
    title: '',
    start_time: '',
    end_time: '',
    description: ''
  })

  // Calendar Utils
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, prevMonthDays - i), isCurrentMonth: false })
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }
    // Next month padding
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }
    return days
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const today = new Date()

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))
    }
  }
  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else if (viewMode === 'week') {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))
    }
  }
  const handleToday = () => { setCurrentDate(new Date()) }

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    if (!newEvent.title || !newEvent.start_time || !newEvent.end_time) return
    try {
      await api.createEvent(newEvent)
      await fetchAllData()
      setShowCreateModal(false)
      setNewEvent({ title: '', start_time: '', end_time: '', description: '' })
    } catch (err) {
      console.error("Failed to create event", err)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    try {
      await api.deleteEvent(eventId)
      await fetchAllData()
      setSelectedEvent(null)
    } catch (err) {
      console.error("Failed to delete event", err)
    }
  }

  return (
    <div className="d-flex h-100 bg-light">
      {/* Left Sidebar */}
      <div className="d-flex flex-column bg-white border-end" style={{ width: '280px' }}>
        <div className="p-3">
          <button
            className="btn btn-light border shadow-sm rounded-pill px-4 py-2 mb-3 d-flex align-items-center gap-2"
            onClick={() => {
              const now = new Date()
              const startStr = now.toISOString().slice(0, 16)
              const end = new Date(now.getTime() + 60 * 60 * 1000)
              const endStr = end.toISOString().slice(0, 16)
              setNewEvent({ title: '', start_time: startStr, end_time: endStr, description: '' })
              setShowCreateModal(true)
            }}
          >
            <i className="bi bi-plus-lg fs-5"></i> Create
          </button>

          {/* Mini Calendar */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-2 px-1">
              <button
                className="btn btn-link p-0 text-decoration-none text-muted"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <h6 className="fw-semibold mb-0 text-dark">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h6>
              <button
                className="btn btn-link p-0 text-decoration-none text-muted"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
            <div className="d-flex flex-wrap">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-muted fw-semibold small py-1" style={{ width: '14.28%' }}>
                  {d[0]}
                </div>
              ))}
              {daysInMonth.map(({ date, isCurrentMonth }) => {
                const isToday = date.toDateString() === today.toDateString()
                return (
                  <div
                    key={date.toDateString()}
                    className="text-center py-1 small cursor-pointer rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: '14.28%', height: '32px' }}
                    onClick={() => setCurrentDate(date)}
                  >
                    <span className={`d-flex align-items-center justify-content-center rounded-circle ${!isCurrentMonth ? 'text-muted' : ''} ${isToday ? 'bg-primary text-white' : ''}`}
                      style={{ width: '24px', height: '24px' }}>
                      {date.getDate()}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Calendar List */}
          <div>
            <h6 className="fw-semibold small text-muted mb-2 px-1">My Calendars</h6>
            <div className="d-flex align-items-center gap-2 py-2 px-1 rounded-2 hover:bg-light cursor-pointer">
              <i className="bi bi-circle-fill text-primary"></i>
              <span className="small">My Calendar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Toolbar */}
        <div className="p-3 border-bottom bg-white d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary btn-sm rounded-1" onClick={handleToday}>
              Today
            </button>
            <div className="d-flex border rounded-1 overflow-hidden">
              <button className="btn btn-light border-0 border-end rounded-0" onClick={handlePrev}>
                <i className="bi bi-chevron-left"></i>
              </button>
              <button className="btn btn-light border-0 rounded-0" onClick={handleNext}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
            <h5 className="mb-0 ms-3 fw-semibold">
              {viewMode === 'month'
                ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                : viewMode === 'week'
                  ? `${new Date(currentDate.getTime() - currentDate.getDay() * 24 * 60 * 60 * 1000).toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${new Date(currentDate.getTime() + (6 - currentDate.getDay()) * 24 * 60 * 60 * 1000).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`
                  : currentDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
              }
            </h5>
          </div>
          <div className="btn-group rounded-1" role="group">
            <button
              type="button"
              className={`btn ${viewMode === 'day' ? 'btn-primary' : 'btn-outline-secondary'} btn-sm`}
              onClick={() => setViewMode('day')}
            >Day</button>
            <button
              type="button"
              className={`btn ${viewMode === 'week' ? 'btn-primary' : 'btn-outline-secondary'} btn-sm`}
              onClick={() => setViewMode('week')}
            >Week</button>
            <button
              type="button"
              className={`btn ${viewMode === 'month' ? 'btn-primary' : 'btn-outline-secondary'} btn-sm`}
              onClick={() => setViewMode('month')}
            >Month</button>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-grow-1 overflow-auto">
          {/* Month View */}
          {viewMode === 'month' && (
            <div className="d-flex flex-column h-100">
              <div className="d-flex border-bottom bg-light sticky-top z-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div
                    key={day}
                    className="text-center py-2 small fw-semibold text-muted"
                    style={{ width: '14.28%' }}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="d-flex flex-wrap flex-grow-1">
                {daysInMonth.map(({ date, isCurrentMonth }) => {
                  const isTodayDate = date.toDateString() === today.toDateString()
                  const dayEvents = events.filter(event => {
                    const evStart = new Date(event.start_time)
                    return evStart.toDateString() === date.toDateString()
                  })
                  return (
                    <div
                      key={date.toDateString()}
                      className="border border-end-0 border-top-0 p-1"
                      style={{ width: '14.28%', minHeight: '120px' }}
                    >
                      <div className="mb-1">
                        <span className={`small d-inline-flex align-items-center justify-content-center rounded-circle ${!isCurrentMonth ? 'text-muted' : ''} ${isTodayDate ? 'bg-primary text-white' : ''}`}
                          style={{ width: '24px', height: '24px' }}>
                          {date.getDate()}
                        </span>
                      </div>
                      <div className="overflow-hidden">
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                            className="bg-primary bg-opacity-10 text-primary border border-primary rounded px-2 py-1 small mb-1 text-truncate cursor-pointer hover:bg-opacity-20"
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Week View */}
          {viewMode === 'week' && (
            <div className="p-4">
              <div className="text-center text-muted py-5">
                <i className="bi bi-calendar-week fs-1 mb-3 opacity-25"></i>
                <p>Week view coming soon!</p>
              </div>
            </div>
          )}

          {/* Day View */}
          {viewMode === 'day' && (
            <div className="p-4">
              <div className="text-center text-muted py-5">
                <i className="bi bi-calendar-day fs-1 mb-3 opacity-25"></i>
                <p>Day view coming soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Create Event</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <form onSubmit={handleCreateEvent}>
                <div className="modal-body">
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control form-control-lg border-0 border-bottom rounded-0"
                      placeholder="Add title"
                      value={newEvent.title}
                      onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={newEvent.start_time}
                        onChange={e => setNewEvent({ ...newEvent, start_time: e.target.value })}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={newEvent.end_time}
                        onChange={e => setNewEvent({ ...newEvent, end_time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control border-0"
                      rows="3"
                      placeholder="Add description"
                      value={newEvent.description}
                      onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-top-0">
                  <button type="button" className="btn btn-link text-muted text-decoration-none" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">{selectedEvent.title}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedEvent(null)}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center gap-2 mb-3 text-muted">
                  <i className="bi bi-clock"></i>
                  <span>{new Date(selectedEvent.start_time).toLocaleString()} - {new Date(selectedEvent.end_time).toLocaleString()}</span>
                </div>
                {selectedEvent.description && (
                  <p className="mb-0">{selectedEvent.description}</p>
                )}
              </div>
              <div className="modal-footer border-top-0">
                <button type="button" className="btn btn-link text-danger text-decoration-none" onClick={() => handleDeleteEvent(selectedEvent.id)}>Delete</button>
                <button type="button" className="btn btn-link text-muted text-decoration-none" onClick={() => setSelectedEvent(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
