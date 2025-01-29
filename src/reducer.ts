import {Action} from "./action";
import React from "react";

export interface Station {
    Address: {
        City: string;
        Country:string
    };
    ChargingStationNames: any;
    ChargingFacilities: any;
    RenewableEnergy: boolean;
    Plugs: any;
    ChargingStationId: any;
    GeoCoordinates: any;
    OpeningTimes: any;
    LocationImage: any;
    IsOpen24Hours: boolean; // Add this line
}

export type State = {
    selectedCity: string,
    selectedTime: {
        day:string,
        hour:string,
        minutes:string
    },
    selectedStation: Station | null
    selectedStations:Station[]
    mapCenter:[number,number]
}
export const InitialState: State = {
    selectedCity: "",
    selectedTime: {
        day:"",
        hour:"",
        minutes:""
    },
    selectedStation:null,
    selectedStations:[],
    mapCenter:[46.8182, 8.2275]
}

export function reducer(state:State, action: Action){
    switch (action.type) {

        case "SET_MAP_CENTER":
            const { mapCoordinates } = action;
            return { ...state, mapCenter: mapCoordinates }

        case "SELECT_CITY":
            let {selectedCity} = action
            return {...state, selectedCity};

        case "SELECT_TIME":
            let {selectedTime} = action
            return {...state, selectedTime}

        case "SELECT_STATION":
            let{selectedStation} = action
            return {...state, selectedStation}

        case "SELECT_STATIONS":
            let{selectedStations} = action
            return {...state, selectedStations}

    }
}

export const StateContext = React.createContext<[State, React.Dispatch<Action>]>(
    [InitialState, (_:Action) =>{
    }]
)
