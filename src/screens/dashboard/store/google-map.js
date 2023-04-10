import React, { useEffect, useRef, useState } from "react";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';




const GoogleMapComponent = (props) => {

    const [location, setLocation] = useState({
        lat: "",
        lng: ""
    });


    let [markers, setMarkers] = useState([{
        "lat": "",
        "lng": ""
    }]);


    const mapStyles = {
        width: '90%',
        height: '100%'
    };

    let onMarkerDragEnd = (coord, index, markers) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        markers[index] = { lat, lng };
        setMarkers(markers);

        showAddressDetails({ lat: lat, lng: lng });
    }

    const autoCompleteRef = useRef();
    const inputRef = useRef();
    // const options = { fields: ["address_components", "geometry", "icon", "name"] };
    const options = {};

    useEffect(() => {
        autoCompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current,
            options
        );

        new window.google.maps.event.addListener(autoCompleteRef.current, 'place_changed', function () {
            let places = autoCompleteRef.current.getPlace();


            let lng = places.geometry.viewport.Ma?.lo;
            let lat = places.geometry.viewport.Ya?.lo;

            let obj = { lat: lat, lng: lng };
            setMarkers([obj]);
            setLocation(obj);
        });

    }, []);



    let myMarkers = markers && Object.entries(markers).map(([key, val]) => (
        <Marker
            key={key}
            id={key}
            position={{
                lat: location.lat,
                lng: location.lng
            }}
            draggable={true}
            // onClick={() => console.log("Clicked")}
            onDragend={(t, map, coord) => onMarkerDragEnd(coord, key, markers)}
        />
    ))


    // Get User's Current Location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
            return;
        }

        alert("Geolocation is not supported by this browser.");
    }, []);


    const showPosition = (position) => {
        let obj = { lat: position.coords.latitude, lng: position.coords.longitude };
        setLocation(obj);
        showAddressDetails(obj);
    }

    const showAddressDetails = (obj) => {
        console.log(obj)
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${obj.lat},${obj.lng}&sensor=false&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`)
            .then(res => res.json())
            .then((response) => {

                response = JSON.stringify(response?.results[0]);
                response = JSON.parse(response);

                let full_address = "";

                // eslint-disable-next-line array-callback-return
                response?.address_components.map(val => {
                    full_address += val?.long_name + ", ";
                });

                if (full_address.length > 2) {
                    full_address = full_address.substring(0, full_address.length - 2);
                }

                document.getElementById("autocomplete").value = full_address;

            }).catch((err) => {
                console.log(err);
            });
    }


    return (
        <>
            <div>
                <div className="row d-flex justify-content-center text-center p-5">
                    <h1>React Google Map v3</h1>
                    <input id="autocomplete" ref={inputRef} type="text" style={{ width: "100%", marginBottom: "15px" }} />
                    <Map
                        google={props.google}
                        zoom={17}
                        style={mapStyles}
                        initialCenter={
                            {
                                lat: location.lat,
                                lng: location.lng
                            }
                        }
                        center={
                            {
                                lat: location.lat,
                                lng: location.lng
                            }
                        }
                    >
                        {myMarkers}
                    </Map>
                </div>
            </div>
        </>
    );
}



export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
})(GoogleMapComponent);