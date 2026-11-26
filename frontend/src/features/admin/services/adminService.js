async function csrfToken() {
  const response = await fetch('/api/admin/auth/csrf', {
    credentials: 'same-origin',
  })

  if (!response.ok) {
    throw new Error('Unable to start a secure admin session')
  }

  const result = await response.json()
  return result.token
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...options,
  })

  if (response.status === 204) {
    return null
  }

  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw Object.assign(
      new Error(result.message || `Request failed (${response.status})`),
      { status: response.status },
    )
  }

  return result
}

async function secureRequest(path, method, body) {
  const token = await csrfToken()
  return request(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': token,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

export function signInAdmin(credentials) {
  return secureRequest('/api/admin/auth/login', 'POST', credentials)
}

export function getAdminSession() {
  return request('/api/admin/auth/me')
}

export async function signOutAdmin() {
  return secureRequest('/api/admin/auth/logout', 'POST')
}

export function getAdminProducts() {
  return request('/api/admin/products')
}

export function createProduct(product) {
  return secureRequest('/api/products', 'POST', product)
}

export async function uploadProductImage(slug, file) {
  const token = await csrfToken()
  const formData = new FormData()
  formData.append('file', file)

  return request(`/api/products/${encodeURIComponent(slug)}/image`, {
    method: 'POST',
    headers: {
      'X-XSRF-TOKEN': token,
    },
    body: formData,
  })
}

export function updateProduct(slug, product) {
  return secureRequest(`/api/products/${encodeURIComponent(slug)}`, 'PUT', product)
}

export function deleteProduct(slug) {
  return secureRequest(`/api/products/${encodeURIComponent(slug)}`, 'DELETE')
}
