import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
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

      <main className="main-content">
        {loading ? (
          <p className="loading-state">Loading...</p>
        ) : !referral ? (
          <div className="not-found-inline">
            <h1>Referral not found</h1>
            <Link to="/">← Back to dashboard</Link>
          </div>
        ) : (
          <div className="detail-content">
            <h1>Referral Details</h1>
            <h2 className="detail-name">{referral.name}</h2>

            <dl className="detail-list">
              <div className="detail-row">
                <dt>Referral ID</dt>
                <dd>{referral.id}</dd>
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

            <Link to="/" className="back-link">
              ← Back to dashboard
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ReferralDetail
