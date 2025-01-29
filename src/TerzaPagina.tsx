import React, { useContext } from 'react';
import {Button, Card, CardContent, Typography, useMediaQuery} from '@mui/material';
import { StateContext, Station } from './reducer';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {Link} from "react-router-dom";

const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const TerzaPagina = () => {
    const [state] = useContext(StateContext);
    const { selectedStation } = state;
    const isMobile = useMediaQuery('(max-width:600px)')

    if (!selectedStation) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', marginTop: '30px', marginLeft: '20px' }}>
            <Card style={{ width: '60%', marginBottom: '20px' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {state.selectedStation?.ChargingStationNames[0]?.value}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Indirizzo:</strong> {state.selectedStation?.Address?.City}, {state.selectedStation?.Address?.Country}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Orario di apertura:</strong> {
                        state.selectedStation?.IsOpen24Hours ? 'Aperto 24h7' : state.selectedStation?.OpeningTimes.filter((x: { Period: { begin: string, end: string }[], on: string }) => x.on === state.selectedTime.day).map((x: { Period: { begin: string, end: string }[], on: string }) => x.on + ': ' + x.Period[0].begin + ' - ' + x.Period[0].end).join()
                    }
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Coordinate geografiche:</strong> {state.mapCenter[0] + " " + state.mapCenter[1]}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Tipo di attacchi:</strong> {state.selectedStation?.Plugs.join(', ')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        <strong>Informazioni sulla ricarica:</strong> Voltage: {state.selectedStation?.ChargingFacilities[0]?.Voltage || "Non Disponibile"}, Amperage: {state.selectedStation?.ChargingFacilities[0]?.Amperage || "Non Disponibile"}, Power: {state.selectedStation?.ChargingFacilities[0]?.power || "Non Disponibile"}, Power Type: {state.selectedStation?.ChargingFacilities[0]?.powertype || "Non Disponibile"}
                    </Typography>
                    <Link to={`/${state.selectedCity}`}>
                        <Button variant="contained" color="primary">
                            Torna alla mappa
                        </Button>
                    </Link>
                </CardContent>
            </Card>
            <div style={{ width: '60%', height: isMobile ? '20vh' : '40vh', position: 'relative' }}>
                <MapContainer center={state.mapCenter} zoom={15} style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', border: '2px solid black' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={state.mapCenter} icon={state.selectedStation?.RenewableEnergy ? greenIcon : redIcon}>
                        <Popup>
                            <Typography variant="subtitle1">{state.selectedStation?.ChargingStationNames[0]?.value}</Typography>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
};

export default TerzaPagina;
