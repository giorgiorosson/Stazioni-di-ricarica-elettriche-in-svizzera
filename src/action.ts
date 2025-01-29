import { Station } from "./reducer";

export type Action =
    | { type: "SELECT_CITY", selectedCity: string }
    | { type: "SELECT_TIME", selectedTime:{day: string,hour:string, minutes:string}}
    | { type: "SELECT_STATION", selectedStation: Station}
    | { type: "SELECT_STATIONS", selectedStations: Station[] }
    | { type: "SET_MAP_CENTER", mapCoordinates: [number, number] }

export function setMapCenter(mapCoordinates: [number, number]): Action {
    return { type: "SET_MAP_CENTER", mapCoordinates };
}

export function selectCity(selectedCity: string): Action {
    return { type: "SELECT_CITY", selectedCity };
}

export function selectTime(selectedTime: { day: string, hour:string, minutes:string }):Action {
    return {type:"SELECT_TIME", selectedTime}
}

export function selectStation(selectedStation: Station): Action {
    return { type: "SELECT_STATION", selectedStation };
}

export function selectStations(selectedStations: Station[]): Action {
    return { type: "SELECT_STATIONS", selectedStations };
}
