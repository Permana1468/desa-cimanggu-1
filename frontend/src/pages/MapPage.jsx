import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services/api';
import L from 'leaflet';

// Fix untuk Leaflet marker icon yang kadang hilang di Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
    const [regions, setRegions] = useState(null);
    const [residents, setResidents] = useState(null);
    const [loading, setLoading] = useState(true);
    const [gisError, setGisError] = useState(false);

    // Kordinat Center Default (Balai Desa / Titik Tengah Titik)
    // Sesuaikan dengan koordinat lokasi nyata
    const defaultPosition = [-6.200000, 106.816666]; // Contoh Jakarta, ganti dengan titik Cimanggu

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                // Fetch Data GeoJSON dari Django
                const [regionsRes, residentsRes] = await Promise.all([
                    api.get('/gis/regions/'),
                    api.get('/gis/residents/')
                ]);

                setRegions(regionsRes.data);
                if (residentsRes.data && residentsRes.data.features) {
                    setResidents(residentsRes.data);
                }
            } catch (error) {
                console.error("Gagal mengambil data peta GIS:", error);
                setGisError(true);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchGeoData();
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Style untuk batas wilayah (Polygon)
    const regionStyle = () => {
        return {
            color: '#2563eb',     // Warna garis biru
            weight: 2,
            opacity: 0.8,
            fillColor: '#60a5fa', // Warna fill biru muda
            fillOpacity: 0.3,
        };
    };

    // Interaksi saat poligon diklik
    const onEachRegion = (feature, layer) => {
        if (feature.properties && feature.properties.name) {
            const popupContent = `
                <div style="text-align:center;">
                    <strong>${feature.properties.region_type}</strong><br/>
                    ${feature.properties.name}
                </div>
            `;
            layer.bindPopup(popupContent);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh]">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-600 font-medium">Memuat data peta Sistem Informasi Geografis...</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Peta Wilayah & Lokasi Penduduk</h2>
            </div>

            {gisError && (
                <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Peringatan Mode Pengembangan</h3>
                            <div className="mt-1 text-sm text-yellow-700">
                                <p>Fitur data GIS (Poligon & Koordinat) saat ini sedang dinonaktifkan sementara di Backend karena masih menunggu instalasi konfigurasi PostGIS (GDAL/GEOS). Anda tetap dapat melihat *base map* di bawah ini.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 rounded-2xl overflow-hidden shadow-md border border-slate-200 relative z-0">
                <MapContainer
                    center={defaultPosition}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Layer Polygon: Batas Wilayah */}
                    {regions && regions.features && regions.features.length > 0 && (
                        <GeoJSON
                            data={regions}
                            style={regionStyle}
                            onEachFeature={onEachRegion}
                        />
                    )}

                    {/* Layer Point: Lokasi Penduduk/Keluarga */}
                    {residents && residents.features && residents.features.length > 0 && (
                        <GeoJSON
                            data={residents}
                            pointToLayer={(feature, latlng) => {
                                return L.marker(latlng);
                            }}
                            onEachFeature={(feature, layer) => {
                                if (feature.properties) {
                                    const props = feature.properties;
                                    const popupContent = `
                                        <div>
                                            <strong>${props.name}</strong><br/>
                                            NIK: ${props.nik || '-'}<br/>
                                            Wilayah: ${props.region_name || '-'}
                                        </div>
                                    `;
                                    layer.bindPopup(popupContent);
                                }
                            }}
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapPage;
