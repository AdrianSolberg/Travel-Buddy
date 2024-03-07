import React, {useEffect, useState} from 'react';
import '../styles/WeatherDisplay.css';
import Image from 'next/image'

interface WeatherDisplayInterface {
    country: string;
    city: string;
}

// Note: The button must be alignes with the rating-stars when they are added
const WeatherDisplay: React.FC<WeatherDisplayInterface> = ({country, city}) => {
    const [temperature, setTemperature] = useState<number>(0);
    const [icon, setIcon] = useState<String[]>([]);

    useEffect(() => {
        const countryCodeApi = `https://restcountries.com/v3.1/name/${country}`;
        
        //First make a fetch request to restcountries to get country code
        fetch(countryCodeApi)
            .then(response => response.json())
            .then((data) => {
                const countryCode = data[0].cca2;
                const geoCodingApi = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${countryCode}&limit=1&appid=971ff3c555137597d9b8ceea73588668`;

                //Then make a fetch request to openweathermap to get geolocation of city (Max 60 requests/minute)
                fetch(geoCodingApi)
                    .then(response => response.json())
                    .then((data) => {
                        const weatherApi = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${data[0].lat}&lon=${data[0].lon}`;

                        //Then make a fetch request to meteorologisk institutt to get weather data
                        fetch(weatherApi)
                            .then(response => response.json())
                            .then(data => {
                                setTemperature(data.properties.timeseries[0].data.instant.details.air_temperature);
                                setIcon(data.properties.timeseries[0].data.next_1_hours.summary.symbol_code);
                            })
                            .catch(() => console.log("Error fetching weather data"));
                    })
                    .catch(() => console.log("Error fetching geolocation"));
            })
            .catch(() => console.log("Error fetching country code"));
    });

    return (
        <>
            <div className="temperatureContainer">{temperature}°C</div>
            <div className="weatherIconContainer">
                {
                    icon.length != 0 ? 
                    <Image 
                        src={`/weatherIcons/${icon}.png`}
                        alt={`${icon}`}
                        width={200}
                        height={200}
                        style={{ width: 'auto', height: '100%' }}
                    /> : <></>
                }
            </div>
        </>
    );
}

export default WeatherDisplay;
