import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchReferrals } from '../services/api'
import { formatDate, formatProfit } from '../utils/formatters'

const ROWS_PER_PAGE = 10

function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [metrics, setMetrics] = useState([])
  const [serviceSummary, setServiceSummary] = useState(null)
  const [referral, setReferral] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      setLoading(true)
      setError('')

      try {
        const response = await fetchReferrals({ search, sort })
        if (cancelled) return

        const data = response.data
        setMetrics(data.metrics || [])
        setServiceSummary(data.serviceSummary || null)
        setReferral(data.referral || null)
        setReferrals(data.referrals || [])
        setCurrentPage(1)
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load referrals')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [search, sort])

  const totalEntries = referrals.length
  const totalPages = Math.max(1, Math.ceil(totalEntries / ROWS_PER_PAGE))
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, totalEntries)
  const paginatedReferrals = referrals.slice(startIndex, endIndex)

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      
    }
  }

  const handleRowClick = (id) => {
    navigate(`/referral/${id}`)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="page">
      <Navbar />

      <main className="main-content">
        <header className="page-header">
          <h1>Referral Dashboard</h1>
          <p>
            Track your referrals, earnings, and partner activity in one place.
          </p>
        </header>

        {loading && <p className="loading-state">Loading...</p>}

        {error && (
          <p className="error-state" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <section className="section" role="region" aria-label="Overview metrics">
              <h2>Overview</h2>
              <div className="metrics-grid">
                {metrics.map((metric) => (
                  <div key={metric.id} className="metric-card">
                    <span className="metric-label">{metric.label}</span>
                    <span className="metric-value">{metric.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {serviceSummary && (
              <section className="section" aria-label="Service summary">
                <h2>Service summary</h2>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Service</span>
                    <span className="summary-value">
                      {serviceSummary.service}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Your Referrals</span>
                    <span className="summary-value">
                      {serviceSummary.yourReferrals}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Active Referrals</span>
                    <span className="summary-value">
                      {serviceSummary.activeReferrals}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Ref. Earnings</span>
                    <span className="summary-value">
                      {serviceSummary.totalRefEarnings}
                    </span>
                  </div>
                </div>
              </section>
            )}

            {referral && (
              <section className="section share-section" aria-label="Share referral">
                <h2>Refer friends and earn more</h2>
                <div className="share-fields">
                  <div className="share-field">
                    <label htmlFor="referral-link">Your Referral Link</label>
                    <div className="share-input-group">
                      <input
                        id="referral-link"
                        type="text"
                        readOnly
                        value={referral.link}
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(referral.link)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="share-field">
                    <label htmlFor="referral-code">Your Referral Code</label>
                    <div className="share-input-group">
                      <input
                        id="referral-code"
                        type="text"
                        readOnly
                        value={referral.code}
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(referral.code)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="section">
              <h2>All referrals</h2>

              <div className="table-controls">
                <input
                  type="text"
                  placeholder="Name or service…"
                  aria-label="Search referrals"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <label className="sort-label">
                  Sort by date
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </label>
              </div>

              <div className="table-wrapper">
                <table className="referrals-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReferrals.length === 0 ? (
                      <tr>
                        <td>No matching entries</td>
                        <td>No matching entries</td>
                        <td>No matching entries</td>
                        <td>No matching entries</td>
                      </tr>
                    ) : (
                      paginatedReferrals.map((row) => (
                        <tr
                          key={row.id}
                          className="table-row-clickable"
                          onClick={() => handleRowClick(row.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleRowClick(row.id)
                            }
                          }}
                          tabIndex={0}
                          role="link"
                        >
                          <td>{row.name}</td>
                          <td>{row.serviceName}</td>
                          <td>{formatDate(row.date)}</td>
                          <td>{formatProfit(row.profit)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalEntries > 0 && (
                <div className="pagination">
                  <p className="pagination-summary">
                    Showing {startIndex + 1}–{endIndex} of {totalEntries}{' '}
                    entries
                  </p>
                  <div className="pagination-controls">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                    {totalPages > 1 &&
                      Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            type="button"
                            className={
                              page === currentPage ? 'page-btn active' : 'page-btn'
                            }
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        )
                      )}
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard
