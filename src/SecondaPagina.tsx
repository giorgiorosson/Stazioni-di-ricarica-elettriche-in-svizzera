import React, {useState, useEffect, useContext} from 'react';
import {Link, useParams} from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import {StateContext, Station} from "./reducer";
import L from 'leaflet';
import {Typography} from "@mui/material";
import {selectStation} from "./action";

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


function SecondaPagina() {
    const { city } = useParams();
    const [state, dispatch] = useContext(StateContext)

    const chargingStations= state.selectedStations

    const handleStationChange = (stationId: string) => {
        const stazioneCliccata = state.selectedStations.find(station => station.ChargingStationId === stationId);
        if (stazioneCliccata!=null) {
            ;
            dispatch(selectStation(stazioneCliccata));
            console.log("Selected Station:", stazioneCliccata);
        }}
    const isStationOpen = (station: Station): boolean => {
        const selectedTime = state.selectedTime;
        if (!selectedTime) return false; //se non seleziono orario non è aperta stazione
        if (!station.OpeningTimes || station.OpeningTimes === 'null') return true; // Se la stazione è aperta 24 ore su 24, restituisci true
        const dayOfWeek = selectedTime.day.toLowerCase(); //ottieni giorno
        const time = `${selectedTime.hour}:${selectedTime.minutes}`; //ottieni ora e minuti
        // Cerca nell'array OpeningTimes della stazione l'oggetto che corrisponde al giorno della settimana selezionato dall'utente
        const openingTime = station.OpeningTimes.find((opening: any) => opening.on.toLowerCase() === dayOfWeek);
        if (!openingTime) return false; //se non lo trova la stazione non è aperta
        return time >= openingTime.period.begin && time <= openingTime.period.end; //true se orario di input nel range di apertura
    };



    return (
        <div>

            <MapContainer center={state.mapCenter} zoom={14} style={{display:'flex', height: '100vh', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {chargingStations.map((station:any, index) => (
                    <Marker key={index}
                            position={[
                                parseFloat(station.GeoCoordinates.Google.split(' ')[0]),
                                parseFloat(station.GeoCoordinates.Google.split(' ')[1])]
                    }
                            icon={station.RenewableEnergy ? greenIcon : redIcon}>

                        <Popup>
                            <Link to={`/${state.selectedCity}/${station.ChargingStationId}`} style={{ textDecoration: 'none' }}>
                                <Typography
                                    onClick={event => {
                                        handleStationChange(station.ChargingStationId);
                                    }}
                                    sx={{
                                        color: 'black',
                                        textDecoration: 'none', // Rimuove la sottolineatura predefinita
                                        cursor: 'pointer',
                                        transition: 'color 0.2s, text-decoration 0.2s', // Aggiunge una transizione di colore e sottolineatura quando mi avvicino al bottone
                                        '&:hover': { //cambiamenti al passaggio del mouse
                                            color: 'blue',
                                            textDecoration: 'underline',
                                        }
                                    }}
                                >
                                    {station.Address.City}:
                                    {station.ChargingStationNames
                                    && station.ChargingStationNames.length > 0 ?
                                        station.ChargingStationNames[0].value : 'N/A' //se non è associato un nome alla stazione metti N/A
                                    }

                                </Typography>
                            </Link>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default SecondaPagina;