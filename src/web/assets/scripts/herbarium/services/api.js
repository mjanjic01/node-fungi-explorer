const ENDPOINT_BASE = '/api/v1';
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

function request(url, options) {
  return fetch(`${ENDPOINT_BASE}${url}`, {
    ...options,
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json',
      'CSRF-Token': csrfToken
    }
  })
  .then(response => response.json())
}


class ApiService {
  createHerbarium(herbarium) {
    return request('/herbarium/new', {
      method: 'POST',
      body: JSON.stringify(herbarium)
    });
  }

  updateHerbariums(herbariums) {
    return Promise.all(herbariums.map((herbarium) => {
      return request(`/herbarium/${herbarium.id}`, {
        method: 'POST',
        body: JSON.stringify(herbarium)
      });
    }));
  }

  deleteHerbariums(herbariumIds) {
    return Promise.all(herbariumIds.map((herbariumId) => {
      return request(`/herbarium/${herbariumId}`, {
        method: 'DELETE',
      });
    }));
  }
}

export default new ApiService();
