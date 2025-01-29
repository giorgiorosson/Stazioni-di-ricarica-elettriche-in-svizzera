import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import {FormControl, InputLabel, Select, MenuItem, Button, CircularProgress, useMediaQuery} from '@mui/material';
import { StateContext, Station } from "./reducer";
import { selectCity, selectStations, selectTime, setMapCenter } from "./action";
import { DateTimePicker, LocalizationProvider, MobileDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function HomePage() {
    const [cities, setCities] = useState<string[]>([]);
    const [stations, setStations] = useState<Station[]>([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedTime, setSelectedTime] = useState<{ day: string, hour: string, minutes: string }>({ day: '', hour: '', minutes: '' });
    const [loading, setLoading] = useState(true);
    const [state, dispatch] = useContext(StateContext)

    useEffect(() => {
        axios.get('https://data.geo.admin.ch/ch.bfe.ladestellen-elektromobilitaet/data/oicp/ch.bfe.ladestellen-elektromobilitaet.json')
            .then(response => {
                const allStations: Station[] = [];
                response.data.EVSEData.forEach((evseData: any) => {
                    evseData.EVSEDataRecord.forEach((record: any) => {
                        const station: Station = {
                            Address: {
                                City: record.Address.City,
                                Country: record.Address.Country,
                            },
                            ChargingStationNames: record.ChargingStationNames,
                            ChargingFacilities: record.ChargingFacilities,
                            RenewableEnergy: record.RenewableEnergy,
                            Plugs: record.Plugs,
                            ChargingStationId: record.ChargingStationId,
                            GeoCoordinates: record.GeoCoordinates,
                            OpeningTimes: record.OpeningTimes,
                            LocationImage: record.LocationImage,
                            IsOpen24Hours: record.IsOpen24Hours
                        };
                        allStations.push(station);
                    });
                });
                setStations(allStations);
                const uniqueCities: string[] = [];
                response.data.EVSEData.forEach((evseData: any) => {
                    evseData.EVSEDataRecord.forEach((record: any) => {
                        const city = record.Address.City.trim(); //trimmo per togliere spazi a inizio e fine;
                        const country = record.Address.Country;
                        //controlla che sia in svizzera
                        if (country === 'CHE' && !uniqueCities.includes(city) && /^[a-zA-Z]/.test(city)) {
                            uniqueCities.push(city);
                        }
                    });
                });
                uniqueCities.sort((a, b) => a.localeCompare(b))
                setCities(uniqueCities);
                setLoading(false); // Setta loading a false quando le città sono state caricate
            })
            .catch(error => {
                console.error('Errore durante il recupero delle città:', error);
                setLoading(false); // Setta loading a false anche in caso di errore
            });
    }, []);

    const handleCityChange = (event: any) => {
        setSelectedCity(event.target.value)
        dispatch(selectCity(event.target.value))
        const selectedCityStations = stations.filter(station => station.Address.City === event.target.value)
        dispatch(selectStations(selectedCityStations))
        if (selectedCityStations.length > 0) {
            const firstStationCoordinates = selectedCityStations[0].GeoCoordinates.Google.split(' ');
            const latitude = parseFloat(firstStationCoordinates[0]);
            const longitude = parseFloat(firstStationCoordinates[1]);
            dispatch(setMapCenter([latitude, longitude]));
        } else {
            dispatch(setMapCenter([46.8182, 8.2275]));
        }
    };

    const handleDateChange = (selectedDate: any) => {
        const dateObject = new Date(selectedDate);
        const dayOfWeek = new Intl.DateTimeFormat('en-EN', { weekday: 'long' }).format(dateObject);

        const hours = String(dateObject.getHours()).padStart(2, '0');
        const minutes = String(dateObject.getMinutes()).padStart(2, '0');
        const selectedTime = {
            day: dayOfWeek,
            hour: hours,
            minutes: minutes
        };
        setSelectedTime(selectedTime);
        dispatch(selectTime(selectedTime));
    };
    const isMobile = useMediaQuery('(max-width:600px)')
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2em' }}>
            {loading ? ( // Se loading è true, visualizza l'indicatore di caricamento
                <CircularProgress />
            ) : (
                <div style={{ marginBottom: '30px', flexDirection: isMobile ? 'column' : 'row', display: 'flex', alignItems: 'center' }}>

                <div style={{ marginRight: '10px', width: '200px',marginBottom: isMobile ? '1em' : '0px' }}>
                        <FormControl style={{ width: '100%' }}>
                            <InputLabel id="city-label">Seleziona la città</InputLabel>
                            <Select
                                labelId="city-label"
                                id="city"
                                value={selectedCity}
                                onChange={handleCityChange}
                                label="Seleziona la città"
                            >
                                <MenuItem value="">
                                    <em>Seleziona una città</em>
                                </MenuItem>
                                {cities.map((city, index) => (
                                    <MenuItem key={index} value={city}>{city}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{ marginRight: '10px', width: '200px', marginBottom: isMobile ? '1em' : '0px' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <MobileDateTimePicker
                                label="Orario"
                                onChange={handleDateChange}
                                ampm={false}
                                format="DD/MM/YYYY HH:mm"
                                sx={{ '& .MuiSelect-select': { textAlign: 'start', color: "black" } }}
                            />
                        </LocalizationProvider>
                    </div>
                    <div>
                        <Link to={`/${selectedCity}`}>
                            <Button variant="contained" color="primary">Cerca</Button>
                        </Link>
                    </div>
                </div>
            )}
            <div style={{ border: '2px solid black', width: '80%', height: '400px' }}>
                <MapContainer center={[46.8182, 8.2275]} zoom={5.5} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </div>
        </div>
    )
}

export default HomePage;
