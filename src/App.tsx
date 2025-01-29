//https:data.geo.admin.ch/ch.bfe.ladestellen-elektromobilitaet/data/oicp/ch.bfe.ladestellen-elektromobilitaet.json
//https:github
//

import React, { useReducer } from 'react';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import HomePage from './HomePage';
import { InitialState, reducer, StateContext } from './reducer';
import SecondaPagina from './SecondaPagina';
import Template from './Template';
import TerzaPagina from './TerzaPagina';

function App() {
    const router = createBrowserRouter([
        {
            path: '',
            element: <Template />,
            children: [
                {
                    path: '',
                    index: true,
                    element: <HomePage />
                },
                {
                    path: ':nameCity',
                    index: true,
                    element: <SecondaPagina />
                },
                {
                    path: ':nameCity/:nameStation',
                    index: true,
                    element: <TerzaPagina />
                }
            ]
        }
    ]);

    return (
        <StateContext.Provider value={useReducer(reducer, InitialState)}>
            <RouterProvider router={router} />
        </StateContext.Provider>
    );
}

export default App;

