import Cookies from 'js-cookie'

const AUTH_URL =
  'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin'
const REFERRALS_URL =
  'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'

function getAuthHeaders() {
  const token = Cookies.get('jwt_token')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export async function login(email, password) {
  const response = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Login failed')
  }

  return data
}

export async function fetchReferrals({ search = '', sort = 'desc' } = {}) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (sort) params.set('sort', sort)

  const url = params.toString()
    ? `${REFERRALS_URL}?${params.toString()}`
    : REFERRALS_URL

  const response = await fetch(url, {
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    const message = data.message || 'Failed to fetch referrals'
    throw new Error(`${message} (${response.status})`)
  }

  return data
}

export async function fetchReferralById(id) {
  const response = await fetch(`${REFERRALS_URL}?id=${id}`, {
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    return null
  }

  const payload = data.data

  if (payload?.referrals?.length) {
    const match = payload.referrals.find((r) => String(r.id) === String(id))
    if (match) return match
  }

  if (payload?.id && String(payload.id) === String(id)) {
    return payload
  }

  return null
}
