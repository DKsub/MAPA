document.getElementById('button').addEventListener('click', function() {
    const cep = document.getElementById('cepReceber').value
    const logradouro = document.getElementById('logradouroInput').value
    const coordenadas = document.getElementById('coordenadasInput').value

    if (cep.match(/^\d{8}$/)) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('logradouro').value = `${data.logradouro}`
                    document.getElementById('bairro').value = `${data.bairro}`
                    document.getElementById('cidade').value = `${data.localidade}`
                    document.getElementById('uf').value = ` ${data.uf}`
                    showMap(data.logradouro, data.bairro, data.localidade)
                } else {
                    alert('CEP não encontrado!')
                }
            })
            .catch(error => console.error('Erro:', error))
    } else if (logradouro) {
        showMap(logradouro)
    } else if (coordenadas) {
        const coords = coordenadas.split(',')
        showMap(null, null, null, { lat: parseFloat(coords[0].trim()), lng: parseFloat(coords[1].trim()) })
    } else {
        alert('Digite um CEP válido (8 dígitos) ou um logradouro/coordenadas.')
    }
})

function showMap(logradouro, bairro, cidade, coords) {
    const map = L.map('map').setView([-23.5505, -46.6333], 12)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map)

    let marker

    if (coords) {
        marker = L.marker(coords).addTo(map)
        map.setView(coords)
    } else if (logradouro) {
        const query = `${logradouro}, ${bairro}, ${cidade}`.trim()
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const location = data[0]
                    const coords = { lat: location.lat, lng: location.lon }
                    marker = L.marker(coords).addTo(map)
                    map.setView(coords)
                    document.getElementById('logradouro').innerText = `Logradouro: ${logradouro}`
                    document.getElementById('bairro').innerText = `Bairro: ${bairro}`
                    document.getElementById('cidade').innerText = `Cidade: ${cidade}`
                } else {
                    alert('Geocoding não encontrou o logradouro.')
                }
            })
            .catch(error => console.error('Erro:', error))
    }
}
