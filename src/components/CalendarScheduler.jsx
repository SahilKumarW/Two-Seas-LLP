import React, { useState, useEffect, useCallback, useMemo } from "react"
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaGlobe,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase"
import { niches } from "../pages/AdminDashboard/constants"
import { getBlockedSlotsForDate } from "../services/blockedSlotsService"
import emailjs from "emailjs-com"

const EMAILJS_SERVICE_ID = "service_wjrb0qk"
const EMAILJS_TEMPLATE_ID = "template_177shrs"
const EMAILJS_PUBLIC_KEY = "vkVckeGL1JQx-x4_q"

// Updated time zones with more city-specific options
export const timeZones = [
  { value: "Pacific/Midway", label: "Midway Island (GMT-11:00)" },
  { value: "Pacific/Honolulu", label: "Honolulu (GMT-10:00)" },
  { value: "America/Anchorage", label: "Anchorage (GMT-09:00)" },
  { value: "America/Los_Angeles", label: "Los Angeles (GMT-08:00)" },
  { value: "America/Denver", label: "Denver (GMT-07:00)" },
  { value: "America/Chicago", label: "Chicago (GMT-06:00)" },
  { value: "America/New_York", label: "New York (GMT-05:00)" },
  { value: "America/Caracas", label: "Caracas (GMT-04:30)" },
  { value: "America/Halifax", label: "Halifax (GMT-04:00)" },
  { value: "America/St_Johns", label: "St. Johns (GMT-03:30)" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (GMT-03:00)" },
  { value: "Atlantic/Azores", label: "Azores (GMT-01:00)" },
  { value: "Europe/London", label: "London (GMT+00:00)" },
  { value: "Europe/Berlin", label: "Berlin (GMT+01:00)" },
  { value: "Europe/Paris", label: "Paris (GMT+01:00)" },
  { value: "Europe/Moscow", label: "Moscow (GMT+03:00)" },
  { value: "Asia/Dubai", label: "Dubai (GMT+04:00)" },
  { value: "Asia/Karachi", label: "Karachi (GMT+05:00)" },
  { value: "Asia/Kolkata", label: "Kolkata (GMT+05:30)" },
  { value: "Asia/Dhaka", label: "Dhaka (GMT+06:00)" },
  { value: "Asia/Bangkok", label: "Bangkok (GMT+07:00)" },
  { value: "Asia/Shanghai", label: "Shanghai (GMT+08:00)" },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+09:00)" },
  { value: "Australia/Sydney", label: "Sydney (GMT+10:00)" },
  { value: "Pacific/Auckland", label: "Auckland (GMT+12:00)" },
]

const CalendarScheduler = ({
  onDateSelected,
  onScheduleSubmit,
  unavailableDates = [],
  title = "Schedule a Meeting",
  submitButtonText = "Send Appointment Request",
  successMessage = "We'll contact you shortly to confirm your appointment.",
  workingHours = { start: 9, end: 21 },
}) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedTimeZone, setSelectedTimeZone] = useState("Asia/Karachi")
  const [errors, setErrors] = useState({})
  const [error, setError] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    niche: "",
    details: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [timeSlots, setTimeSlots] = useState([])
  const [blockedSlots, setBlockedSlots] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [showWorldClock, setShowWorldClock] = useState(false)
  const [worldClocks, setWorldClocks] = useState([])
  const [timeFormat, setTimeFormat] = useState("12h")

  const addWorldClock = useCallback((timezone) => {
    setWorldClocks((prev) => {
      if (prev.some((clock) => clock.timezone === timezone)) return prev
      const newClock = {
        timezone,
        label: timeZones.find((tz) => tz.value === timezone)?.label || timezone,
        time: "",
      }
      return [...prev, newClock]
    })
  }, [])

  const removeWorldClock = useCallback((timezone) => {
    setWorldClocks((prev) => prev.filter((clock) => clock.timezone !== timezone))
  }, [])

  useEffect(() => {
    if (worldClocks.length === 0) return

    const updateWorldClocks = () => {
      setWorldClocks((prev) =>
        prev.map((clock) => {
          try {
            const now = new Date()
            const formatter = new Intl.DateTimeFormat("en-US", {
              timeZone: clock.timezone,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })
            return {
              ...clock,
              time: formatter.format(now),
            }
          } catch (error) {
            console.error("Error updating world clock:", error)
            return clock
          }
        }),
      )
    }

    updateWorldClocks()
    const timer = setInterval(updateWorldClocks, 1000)
    return () => clearInterval(timer)
  }, [worldClocks.length])

  const detectUserLocation = useCallback(async () => {
    setIsDetectingLocation(true)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const ipResponse = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (!ipResponse.ok) {
        throw new Error(`HTTP error! status: ${ipResponse.status}`)
      }

      const ipData = await ipResponse.json()

      if (ipData.error) {
        throw new Error(ipData.reason || "IP geolocation service error")
      }

      const locationData = {
        country: ipData.country_name,
        city: ipData.city,
        region: ipData.region,
        timezone: ipData.timezone,
        source: "ip",
      }
      setUserLocation(locationData)

      if (ipData.timezone && timeZones.some((tz) => tz.value === ipData.timezone)) {
        setSelectedTimeZone(ipData.timezone)
        addWorldClock(ipData.timezone)
      }
    } catch (error) {
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const fallbackLocation = {
        timezone: browserTimezone,
        source: "browser",
      }
      setUserLocation(fallbackLocation)

      if (browserTimezone && timeZones.some((tz) => tz.value === browserTimezone)) {
        setSelectedTimeZone(browserTimezone)
        addWorldClock(browserTimezone)
      }

      if (process.env.NODE_ENV === "development") {
        console.warn("Location detection failed, using browser timezone:", error)
      }
    } finally {
      setIsDetectingLocation(false)
    }
  }, [addWorldClock])

  useEffect(() => {
    detectUserLocation()
  }, [detectUserLocation])

  useEffect(() => {
    if (!selectedTimeZone) return

    const updateClock = () => {
      try {
        const now = new Date()
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: selectedTimeZone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
        setCurrentTime(formatter.format(now))
      } catch (error) {
        console.error("Invalid time zone:", selectedTimeZone, error)
      }
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [selectedTimeZone])

  const convertTimeToTimezone = useCallback((time, fromTimezone, toTimezone) => {
    try {
      const date = new Date()
      const [timePart, period] = time.split(" ")
      let [hours, minutes] = timePart.split(":").map(Number)

      if (period === "PM" && hours !== 12) hours += 12
      if (period === "AM" && hours === 12) hours = 0

      date.setHours(hours, minutes || 0, 0, 0)

      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: toTimezone,
      })
    } catch (error) {
      console.error("Error converting time:", error)
      return time
    }
  }, [])

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target
      setUserDetails((prev) => ({
        ...prev,
        [name]: value,
      }))
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }
    },
    [errors],
  )

  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const daysArray = []

    for (let i = 0; i < startingDay; i++) {
      daysArray.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      daysArray.push(date)
    }

    return daysArray
  }, [currentMonth, currentYear])

  const isDateDisabled = useCallback(
    (date) => {
      if (!date) return true

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (date < today) return true

      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) return true

      const dateString = date.toISOString().split("T")[0]
      if (unavailableDates.includes(dateString)) return true

      return false
    },
    [unavailableDates],
  )

  const formatDateLocal = useCallback((date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }, [])

  const generateTimeSlots = useCallback(
    async (date, timeZone = selectedTimeZone) => {
      const slots = []
      const startHour = workingHours.start
      const endHour = workingHours.end
      const dateString = formatDateLocal(date)

      try {
        const blockedSlotsForDate = await getBlockedSlotsForDate(dateString)

        for (let hour = startHour; hour <= endHour; hour++) {
          const time24 = `${hour.toString().padStart(2, "0")}:00:00`
          const time12 = new Date(date)
          time12.setHours(hour, 0, 0, 0)

          const displayTime = time12.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: timeZone,
          })

          const isBlocked = blockedSlotsForDate.some((slot) => slot.time === time24)

          slots.push({
            systemTime: time24,
            displayTime: displayTime,
            isAvailable: !isBlocked,
          })
        }
      } catch (error) {
        console.error("Error generating slots:", error)
        // Fallback - return all slots as available
        for (let hour = startHour; hour <= endHour; hour++) {
          const time12 = new Date(date)
          time12.setHours(hour, 0, 0, 0)
          slots.push({
            systemTime: `${hour.toString().padStart(2, "0")}:00:00`,
            displayTime: time12.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: timeZone,
            }),
            isAvailable: true,
          })
        }
      }

      return slots
    },
    [workingHours.start, workingHours.end, selectedTimeZone, formatDateLocal],
  )

  const handleDateClick = useCallback(
    async (date) => {
      if (!date || isDateDisabled(date)) return

      setSelectedDate(date)
      setSelectedTime(null)
      setIsSuccess(false)

      const slots = await generateTimeSlots(date, selectedTimeZone)
      setTimeSlots(slots)

      if (onDateSelected) {
        onDateSelected(formatDateLocal(date))
      }
    },
    [isDateDisabled, generateTimeSlots, selectedTimeZone, formatDateLocal, onDateSelected],
  )

  const handleTimeZoneChange = useCallback(
    async (e) => {
      const newTimeZone = e.target.value
      setSelectedTimeZone(newTimeZone)

      if (selectedDate) {
        const slots = await generateTimeSlots(selectedDate, newTimeZone)
        setTimeSlots(slots)
      }
    },
    [selectedDate, generateTimeSlots],
  )

  const handleTimeClick = useCallback((time) => {
    setSelectedTime(time)
  }, [])

  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!userDetails.name.trim()) {
      newErrors.name = "Name is required"
    } else if (userDetails.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!userDetails.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(userDetails.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!userDetails.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[0-9+\-\s()]{10,}$/.test(userDetails.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!userDetails.niche) {
      newErrors.niche = "Please select a niche"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [userDetails])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      if (!validateForm() || !selectedDate || !selectedTime) {
        setError("Please fill in all required fields")
        return
      }

      setIsSubmitting(true)
      setError("")

      try {
        const meetingHour = Number.parseInt(selectedTime.split(":")[0])
        const meetingMinutes = Number.parseInt(selectedTime.split(":")[1].split(" ")[0])
        const isPM = selectedTime.includes("PM")

        const meetingData = {
          ...userDetails,
          appointmentDate: selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          appointmentTime: selectedTime,
          timeZone: selectedTimeZone,
          timestamp: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            isPM && meetingHour !== 12 ? meetingHour + 12 : meetingHour,
            meetingMinutes,
            0,
            0,
          ).toISOString(),
          status: "pending",
          createdAt: serverTimestamp(),
        }

        const docRef = await addDoc(collection(db, "meetings"), meetingData)
        console.log("Meeting submitted with ID:", docRef.id)

        try {
          const templateParams = {
            to_name: userDetails.name,
            to_email: userDetails.email,
            appointment_date: formatDateDisplay(selectedDate),
            appointment_time: convertTimeToTimezone(selectedTime, "Asia/Karachi", selectedTimeZone),
            timezone: selectedTimeZone,
            from_name: "Two Seas",
            reply_to: "support@twoseas.org",
          }

          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
        } catch (emailError) {
          console.error("Email sending failed:", emailError)
          // Don't fail the entire submission if email fails
        }

        setUserDetails({
          name: "",
          email: "",
          phone: "",
          company: "",
          website: "",
          niche: "",
          details: "",
        })
        setIsSuccess(true)

        if (onScheduleSubmit) {
          onScheduleSubmit(meetingData)
        }
      } catch (error) {
        console.error("Submission error:", error)
        setError(`Failed to schedule appointment: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setIsSubmitting(false)
      }
    },
    [validateForm, selectedDate, selectedTime, userDetails, selectedTimeZone, convertTimeToTimezone, onScheduleSubmit],
  )

  const changeMonth = useCallback(
    (increment) => {
      setCurrentMonth((prev) => {
        let newMonth = prev + increment
        let newYear = currentYear

        if (newMonth < 0) {
          newMonth = 11
          newYear--
        } else if (newMonth > 11) {
          newMonth = 0
          newYear++
        }

        setCurrentYear(newYear)
        return newMonth
      })
    },
    [currentYear],
  )

  const monthName = useMemo(
    () =>
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][currentMonth],
    [currentMonth],
  )

  const formatDateDisplay = useCallback((date) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }, [])

  const formatTime = useCallback((timeString, format) => {
    if (!timeString) return "--:-- --"
    if (format === "24h") {
      const [time, period] = timeString.split(" ")
      let [hours, minutes] = time.split(":")
      if (period === "PM" && hours !== "12") {
        hours = String(Number(hours) + 12)
      }
      if (period === "AM" && hours === "12") {
        hours = "00"
      }
      return `${hours}:${minutes}`
    }
    return timeString
  }, [])

  const WorldClockRegion = React.memo(({ title, clocks, removeClock, timeFormat }) => {
    if (clocks.length === 0) return null

    return (
      <div className="world-clock-region">
        <div className="region-title">{title}</div>
        {clocks.map((clock, index) => (
          <div key={index} className="world-clock-item">
            <div className="world-clock-city">
              {clock.label.split(" (")[0].replace(/(America|Asia|Europe|Africa|Australia|Pacific|Atlantic)\//, "")}
            </div>
            <div className="world-clock-time">{formatTime(clock.time, timeFormat)}</div>
            <button
              className="remove-clock-btn"
              onClick={() => removeClock(clock.timezone)}
              title="Remove clock"
              aria-label={`Remove ${clock.label} clock`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )
  })

  return (
    <div className="calendar-scheduler" onClick={(e) => e.stopPropagation()}>
      <div className="scheduler-header">
        <h2 className="text-3xl font-bold text-blue-600 mt-6">{title}</h2>
        <div className="header-divider"></div>
      </div>

      <div className="scheduler-container mb-8">
        <div className="scheduler-card">
          {!selectedDate ? (
            // Calendar View
            <div className="calendar-view">
              <div className="scheduler-icon" aria-hidden="true">
                <FaCalendarAlt />
              </div>
              <div className="calendar-header-fixed">
                <div className="calendar-header">
                  <button className="month-nav-btn" onClick={() => changeMonth(-1)} aria-label="Previous month">
                    <FaChevronLeft />
                  </button>
                  <h3>
                    {monthName} {currentYear}
                  </h3>
                  <button className="month-nav-btn" onClick={() => changeMonth(1)} aria-label="Next month">
                    <FaChevronRight />
                  </button>
                </div>
              </div>

              <div className="calendar-grid-container">
                <div className="day-names" role="row">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="day-name" role="columnheader">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="days-grid" role="grid">
                  {days.map((date, index) => (
                    <button
                      key={index}
                      className={`day-cell ${!date ? "empty" : ""} ${date && isDateDisabled(date) ? "disabled" : ""}`}
                      onClick={() => handleDateClick(date)}
                      disabled={!date || isDateDisabled(date)}
                      aria-label={date ? `Select ${formatDateDisplay(date)}` : undefined}
                      role="gridcell"
                    >
                      {date && (
                        <>
                          <div className="day-number">{date.getDate()}</div>
                          {unavailableDates.includes(date.toISOString().split("T")[0]) && (
                            <div className="booked-indicator">Booked</div>
                          )}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : !selectedTime ? (
            // Time Slot Selection
            <div className="time-slot-view">
              <div className="time-zone-selector">
                <FaGlobe className="time-zone-icon" aria-hidden="true" />
                {userLocation && (
                  <span className="detected-location">
                    {userLocation.city && `${userLocation.city}, `}
                    {userLocation.country || userLocation.timezone}
                  </span>
                )}
                <select
                  value={selectedTimeZone}
                  onChange={handleTimeZoneChange}
                  className="time-zone-dropdown"
                  aria-label="Select timezone"
                >
                  {timeZones.map((zone) => (
                    <option key={zone.value} value={zone.value}>
                      {zone.label}
                    </option>
                  ))}
                </select>
                {isDetectingLocation && <FaSpinner className="spinner" aria-hidden="true" />}
              </div>

              <h3>Select a Time Slot</h3>
              <p className="selected-date">{formatDateDisplay(selectedDate)}</p>
              <div className="current-time-display">
                <FaClock aria-hidden="true" />
                Current time in {selectedTimeZone.split("/")[1] || selectedTimeZone}: <strong>{currentTime}</strong>
              </div>

              <div className="time-slots-grid" role="group" aria-label="Available time slots">
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      className={`time-slot-btn ${!slot.isAvailable ? "blocked" : ""}`}
                      disabled={!slot.isAvailable}
                      onClick={() => slot.isAvailable && handleTimeClick(slot.systemTime)}
                      aria-label={`${slot.displayTime} ${slot.isAvailable ? "available" : "booked"}`}
                    >
                      {slot.displayTime}
                      {!slot.isAvailable && <span className="blocked-label">Booked</span>}
                    </button>
                  ))
                ) : (
                  <p>No available time slots for this date</p>
                )}
              </div>

              <div className="time-slot-actions">
                <button className="back-btn" onClick={() => setSelectedDate(null)}>
                  Back to Calendar
                </button>
              </div>
            </div>
          ) : isSuccess ? (
            // Success Message
            <div className="success-message">
              <h3>Appointment Request Sent!</h3>
              <p>Your appointment request has been sent for:</p>
              <p className="confirmation-details">
                <strong>{formatDateDisplay(selectedDate)}</strong>
                {selectedTime && (
                  <>
                    , <strong>{convertTimeToTimezone(selectedTime, "GMT+05:00", selectedTimeZone)}</strong>
                  </>
                )}
                {selectedTimeZone && (
                  <>
                    , <strong>{selectedTimeZone}</strong>
                  </>
                )}
              </p>
              <p>{successMessage}</p>
              <div className="button-container">
                <button
                  className="primary-btn"
                  onClick={() => {
                    setSelectedDate(null)
                    setSelectedTime(null)
                    setIsSuccess(false)
                  }}
                >
                  Schedule Another Appointment
                </button>
              </div>
            </div>
          ) : (
            // Appointment Form
            <div className="appointment-form-container">
              <h3>Confirm Your Appointment</h3>
              <p className="selected-slot">
                {formatDateDisplay(selectedDate)}
                {selectedTime && `, ${convertTimeToTimezone(selectedTime, "Asia/Karachi", selectedTimeZone)}`}
                {selectedTimeZone &&
                  ` (${timeZones.find((tz) => tz.value === selectedTimeZone)?.label || selectedTimeZone})`}
              </p>

              {error && (
                <div className="error-notification" role="alert">
                  <FaExclamationTriangle aria-hidden="true" /> {error}
                </div>
              )}

              <div className="form-scroll-container">
                <form onSubmit={handleSubmit} className="appointment-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={userDetails.name}
                      onChange={handleInputChange}
                      required
                      minLength={2}
                      maxLength={50}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <span id="name-error" className="error-text" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                      required
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <span id="email-error" className="error-text" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                      required
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                    {errors.phone && (
                      <span id="phone-error" className="error-text" role="alert">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">Company Name</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={userDetails.company}
                      onChange={handleInputChange}
                      maxLength={50}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="website">Company Website</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={userDetails.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      aria-describedby={errors.website ? "website-error" : undefined}
                    />
                    {errors.website && (
                      <span id="website-error" className="error-text" role="alert">
                        {errors.website}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="niche">Niche of Hiring *</label>
                    <select
                      id="niche"
                      name="niche"
                      value={userDetails.niche}
                      onChange={handleInputChange}
                      required
                      aria-describedby={errors.niche ? "niche-error" : undefined}
                    >
                      <option value="">Select a niche</option>
                      {niches.map((niche) => (
                        <option key={niche.id} value={niche.name}>
                          {niche.name}
                        </option>
                      ))}
                    </select>
                    {errors.niche && (
                      <span id="niche-error" className="error-text" role="alert">
                        {errors.niche}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="details">Additional Details</label>
                    <textarea
                      id="details"
                      name="details"
                      value={userDetails.details}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Please share any specific requirements..."
                      maxLength={500}
                    />
                  </div>
                </form>
              </div>

              <div className="form-buttons">
                <button type="submit" className="confirm-btn" disabled={isSubmitting} onClick={handleSubmit}>
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="spinner" aria-hidden="true" /> Sending...
                    </>
                  ) : (
                    submitButtonText
                  )}
                </button>

                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setSelectedTime(null)}
                  disabled={isSubmitting}
                >
                  Back to Time Slots
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
                .calendar-scheduler {
                    max-width: 800px;
                    margin: 0 auto;
                    font-family: 'Arial', sans-serif;
                }
                
                .scheduler-header {
                    text-align: center;
                    margin-bottom: 2rem;
                    margin-top: 2rem;
                }
                
                .header-divider {
                    width: 100px;
                    height: 3px;
                    background-color: #06a3c2;
                    margin: 10px auto;
                }
                
                .scheduler-container {
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    padding: 2rem;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    margin-bottom: 2rem;
                }
                
                .scheduler-card {
                    text-align: center;
                }
                
                .scheduler-icon {
                    font-size: 2rem;
                    color: #2A2D7C;
                    margin-bottom: 1rem;
                }
                
                .calendar-view {
                    max-width: 500px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                }
                
                .calendar-header-fixed {
                    position: sticky;
                    top: 0;
                    background: white;
                    z-index: 10;
                    padding: 10px 0;
                }
                
                .calendar-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                }
                
                .calendar-header h3 {
                    margin: 0;
                    color: #2A2D7C;
                    font-size: 1.2rem;
                    white-space: nowrap;
                }
                
                .month-nav-btn {
                    background: none;
                    border: none;
                    font-size: 1rem;
                    cursor: pointer;
                    color: #2A2D7C;
                    padding: 0.5rem;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                
                .month-nav-btn:hover:not(:disabled) {
                    color: #06a3c2;
                    background-color: #f0f8ff;
                }
                
                .calendar-grid-container {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    width: 100%;
                }
                
                .day-names {
                    display: grid;
                    grid-template-columns: repeat(7, minmax(40px, 1fr));
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                    color: #2A2D7C;
                    position: sticky;
                    left: 0;
                    background: white;
                    min-width: 280px;
                }
                
                .day-name {
                    padding: 0.5rem;
                }
                
                .days-grid {
                    display: grid;
                    grid-template-columns: repeat(7, minmax(40px, 1fr));
                    gap: 5px;
                    min-width: 280px;
                }
                
                .day-cell {
                    min-height: 50px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                    padding: 0.2rem;
                    aspect-ratio: 1;
                    background: none;
                    border: 1px solid transparent;
                }
                
                .day-cell:not(.empty):not(.disabled):hover {
                    background-color: #e1f5fe;
                    border-color: #06a3c2;
                }
                
                .day-cell:not(.empty):not(.disabled):focus {
                    outline: 2px solid #06a3c2;
                    outline-offset: 2px;
                }
                
                .day-cell.empty {
                    visibility: hidden;
                }
                
                .day-cell.disabled {
                    color: #ccc;
                    cursor: not-allowed;
                    opacity: 0.5;
                }
                
                .day-number {
                    font-size: 0.9rem;
                    font-weight: bold;
                }
                
                .booked-indicator {
                    font-size: 0.6rem;
                    color: #f44336;
                    margin-top: 2px;
                }
                
                .time-slot-view {
                    max-width: 500px;
                    margin: 0 auto;
                }
                
                .time-slot-view h3 {
                    color: #2A2D7C;
                    margin-bottom: 0.5rem;
                }
                
                .selected-date {
                    color: #2A2D7C;
                    font-weight: bold;
                    margin-bottom: 1.5rem;
                }
                
                .current-time-display {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 1rem;
                    margin-bottom: 16px;
                    padding: 10px 14px;
                    background-color: #f9f9f9;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    color: #333;
                }
                
                .current-time-display strong {
                    color: #2A2D7C;
                    font-weight: bold;
                }
                
                .time-slots-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 10px;
                    margin-bottom: 1.5rem;
                }
                
                .time-slot-btn {
                    padding: 10px;
                    background-color: #06a3c2;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 0.9rem;
                }
                
                .time-slot-btn:hover:not(:disabled) {
                    background-color: #2A2D7C;
                    transform: translateY(-1px);
                }
                
                .time-slot-btn:focus {
                    outline: 2px solid #06a3c2;
                    outline-offset: 2px;
                }
                
                .time-slot-btn.blocked {
                    background-color: #f8d7da;
                    color: #721c24;
                    cursor: not-allowed;
                    position: relative;
                }
                
                .time-slot-btn.blocked:hover {
                    background-color: #f8d7da;
                    transform: none;
                }
                
                .blocked-label {
                    display: block;
                    font-size: 0.7em;
                    color: #dc3545;
                    margin-top: 4px;
                }
                
                .time-slot-actions {
                    display: flex;
                    justify-content: center;
                }
                
                .appointment-form-container {
                    display: flex;
                    flex-direction: column;
                    max-height: 80vh;
                }
                
                .selected-slot {
                    font-size: 1.1rem;
                    color: #2A2D7C;
                    margin-bottom: 1.5rem;
                    text-align: center;
                    font-weight: bold;
                    flex-shrink: 0;
                }
                
                .form-scroll-container {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding-right: 8px;
                    margin-bottom: 15px;
                }
                
                .form-scroll-container::-webkit-scrollbar {
                    width: 6px;
                }
                
                .form-scroll-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .form-scroll-container::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                
                .form-scroll-container::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                
                .form-group {
                    margin-bottom: 1rem;
                    text-align: left;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                    color: #333;
                }
                
                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                    transition: border-color 0.2s;
                }
                
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #06a3c2;
                    box-shadow: 0 0 0 2px rgba(6, 163, 194, 0.2);
                }
                
                .form-group textarea {
                    min-height: 100px;
                    resize: vertical;
                }
                
                .error-text {
                    color: #dc3545;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: block;
                }
                
                .error-notification {
                    background-color: #f8d7da;
                    color: #721c24;
                    padding: 12px;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .form-buttons {
                    display: flex;
                    justify-content: space-between;
                    margin-top: auto;
                    padding-top: 15px;
                    flex-shrink: 0;
                    border-top: 1px solid #eee;
                    gap: 1rem;
                }
                
                .confirm-btn,
                .back-btn,
                .primary-btn {
                    padding: 12px 24px;
                    background-color: #2A2D7C;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .confirm-btn:hover:not(:disabled),
                .back-btn:hover:not(:disabled),
                .primary-btn:hover:not(:disabled) {
                    background-color: #1a1c52;
                    transform: translateY(-1px);
                }
                
                .confirm-btn:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .success-message {
                    text-align: center;
                    max-width: 500px;
                    margin: 0 auto;
                }
                
                .success-message h3 {
                    color: #2A2D7C;
                    margin-bottom: 1rem;
                }
                
                .confirmation-details {
                    font-size: 1.1rem;
                    margin: 1.5rem 0;
                    padding: 1rem;
                    background-color: #f0f8ff;
                    border-radius: 4px;
                    border-left: 4px solid #06a3c2;
                }
                
                .button-container {
                    margin-top: 1.5rem;
                }
                
                .time-zone-selector {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                    background: #f5f5f5;
                    padding: 10px 15px;
                    border-radius: 6px;
                    flex-wrap: wrap;
                }
                
                .detected-location {
                    font-size: 0.9rem;
                    color: #2A2D7C;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 150px;
                }
                
                .time-zone-dropdown {
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    background: white;
                    font-size: 14px;
                    min-width: 200px;
                    flex: 1;
                }
                
                .time-zone-icon {
                    color: #2A2D7C;
                    font-size: 18px;
                    flex-shrink: 0;
                }
                
                .spinner {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                /* Mobile Responsive Styles */
                @media (max-width: 768px) {
                    .scheduler-container {
                        padding: 1rem;
                    }
                    
                    .appointment-form-container {
                        max-height: 70vh;
                    }
                    
                    .form-buttons {
                        flex-direction: column;
                    }
                    
                    .confirm-btn, .back-btn {
                        width: 100%;
                    }
                    
                    .time-zone-selector {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .time-zone-dropdown {
                        width: 100%;
                        min-width: auto;
                    }
                }
                
                @media (max-width: 600px) {
                    .calendar-header h3 {
                        font-size: 1rem;
                    }
                    
                    .month-nav-btn {
                        padding: 5px;
                    }
                    
                    .day-names {
                        grid-template-columns: repeat(7, 60px);
                        min-width: 420px;
                        font-size: 0.8rem;
                    }
                    
                    .days-grid {
                        grid-template-columns: repeat(7, 60px);
                        min-width: 420px;
                    }
                    
                    .day-cell {
                        min-height: 60px;
                    }
                    
                    .day-number {
                        font-size: 0.8rem;
                    }
                    
                    .booked-indicator {
                        font-size: 0.5rem;
                    }
                    
                    .time-slots-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .time-slot-btn {
                        padding: 8px;
                        font-size: 0.8rem;
                    }
                }
            `}</style>
    </div>
  )
}

export default CalendarScheduler;