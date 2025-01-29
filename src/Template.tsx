import {HomeRounded} from "@mui/icons-material";
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import {Link, Outlet, useLocation} from "react-router-dom";
import {useContext} from "react";
import {StateContext} from "./reducer";

function Template() {
    const [state, dispatch] = useContext(StateContext)
    const location = useLocation();
    let fraseTemplate = "STAZIONI DI RICARICA IN SVIZZERA";

    // Verifica se la pagina attuale è una pagina specifica e aggiorna fraseTemplate di conseguenza
    if (location.pathname === "/") {
        fraseTemplate = "STAZIONI DI RICARICA IN SVIZZERA";
    } else if (location.pathname===(`/${state.selectedCity}`)) {
        fraseTemplate = `Stazioni di ricarica a ${state.selectedCity}`;
    } else if (location.pathname===(`/${state.selectedCity}/${state.selectedStation?.ChargingStationId}`)) {
        fraseTemplate = `Informazioni sulla stazione`
    }

    return (
        <AppBar sx={{height:'65px', display:'flex'}}>
            <Toolbar>
                <IconButton component={Link} to={'/'}>
                    <HomeRounded/>
                </IconButton>
                <Typography variant={'h6'}>
                    {fraseTemplate}
                </Typography>
            </Toolbar>
            <Outlet/>
        </AppBar>
    );
}

export default Template;
