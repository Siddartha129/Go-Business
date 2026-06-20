import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { fetchReferralById } from '../services/api'
import { formatDate, formatProfit } from '../utils/formatters'

function ReferralDetail() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [referral, setReferral] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadReferral() {
      setLoading(true)
      try {
        const data = await fetchReferralById(id)
        if (!cancelled) {
          setReferral(data)
        }
      } catch {
        if (!cancelled) {
          setReferral(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadReferral()

    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="page">
      <Navbar />

      <main className="main-content detail-page">
        {loading ? (
          <p className="loading-state">Loading...</p>
        ) : !referral ? (
          <div className="not-found-inline">
            <Link to="/" className="back-link">
              ← Back to dashboard
            </Link>
            <h1>Referral not found</h1>
          </div>
        ) : (
          <>
            <Link to="/" className="back-link">
              ← Back to dashboard
            </Link>

            <header className="detail-page-header">
              <h1>Referral Details</h1>
              <p>Full information for this referral partner.</p>
            </header>

            <div className="detail-card">
              <div className="detail-card-header">
                <h2 className="detail-partner-name">{referral.name}</h2>
                <span className="detail-service-badge">
                  {referral.serviceName}
                </span>
              </div>

              <dl className="detail-list">
                <div className="detail-row">
                  <dt>Referral ID</dt>
                  <dd>{referral.id}</dd>
                </div>
                <div className="detail-row">
                  <dt>Name</dt>
                  <dd>{referral.name}</dd>
                </div>
                <div className="detail-row">
                  <dt>Service Name</dt>
                  <dd>{referral.serviceName}</dd>
                </div>
                <div className="detail-row">
                  <dt>Date</dt>
                  <dd>{formatDate(referral.date)}</dd>
                </div>
                <div className="detail-row">
                  <dt>Profit</dt>
                  <dd>{formatProfit(referral.profit)}</dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default ReferralDetail
