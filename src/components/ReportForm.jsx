import React, { useState } from 'react'

export function ReportForm({
  ageGroups,
  symptomCategories,
  environmentIssues,
  onSubmit,
}) {
  const [region, setRegion] = useState('')
  const [ageGroup, setAgeGroup] = useState('')
  const [symptomCategory, setSymptomCategory] = useState('')
  const [environmentIssue, setEnvironmentIssue] = useState('')
  const [mentalHealthFlag, setMentalHealthFlag] = useState(false)
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!region || !ageGroup || !symptomCategory || !environmentIssue) {
      setError('Please complete all required fields (region, age group, symptom, environment).')
      return
    }

    onSubmit({
      region: region.trim(),
      ageGroup,
      symptomCategory,
      environmentIssue,
      mentalHealthFlag,
      notes: notes.trim(),
    })
    setSubmitted(true)
    setRegion('')
    setAgeGroup('')
    setSymptomCategory('')
    setEnvironmentIssue('')
    setMentalHealthFlag(false)
    setNotes('')
    setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label>
            Region / Postal code <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., M5V, K1A, or city / neighbourhood"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>
            Age group <span className="required">*</span>
          </label>
          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
          >
            <option value="">Select age range</option>
            {ageGroups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>
            Main symptom today <span className="required">*</span>
          </label>
          <select
            value={symptomCategory}
            onChange={(e) => setSymptomCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {symptomCategories.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>
            Environment issue <span className="required">*</span>
          </label>
          <select
            value={environmentIssue}
            onChange={(e) => setEnvironmentIssue(e.target.value)}
          >
            <option value="">Select an issue</option>
            {environmentIssues.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-field checkbox-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={mentalHealthFlag}
            onChange={(e) => setMentalHealthFlag(e.target.checked)}
          />
          <span>This check-in includes mental health strain (stress, anxiety, low mood)</span>
        </label>
      </div>

      <div className="form-field">
        <label>Optional notes</label>
        <textarea
          rows={4}
          placeholder="Short details – for example, how long this has been going on, or other context that might help public health teams."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && <p className="error-text">{error}</p>}
      {submitted && <p className="success-text">Thank you – your anonymous check-in has been recorded.</p>}

      <div className="form-footer">
        <div className="privacy-note">
          <p>
            This prototype does not collect names, emails, or phone numbers. All data stays in your browser for demo purposes.
          </p>
        </div>
        <button type="submit" className="primary-btn glow-border">
          Submit check-in
        </button>
      </div>
    </form>
  )
}
