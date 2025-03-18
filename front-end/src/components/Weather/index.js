import React,{useState} from 'react'
import countries from "i18n-iso-countries"
import { MagnifyingGlass } from "@phosphor-icons/react";
import "./index.css"

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));


const Weather = () => {
    const [data, setMainData] = useState([])
    const [tempData,setTempData] = useState('')
    const [weatherData,setWeatherData] = useState('')
    const [weatherIcon,setWeatherIcon] = useState('')
    const [country,setCountry] = useState(null)
    const [loading, setLoading] = useState(true)
    const [cityName, setCityName] = useState('')
    const [errMsg , setErrMsg] = useState('')
    const [error, setError] = useState(null)

  

    

    const onChangeCityName = (event) => {
      setCityName(event.target.value)
    }


    const handleSubmit = (event) => {
      event.preventDefault()
      setError(null);
      setErrMsg('');

      const fetchData = async () => {
        try {
             const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=2a5ada903f539d0c51f9deda388f6ca4&&units=metric`);
              if (!response.ok) {
                if (response.status === 404) {
                  setErrMsg("City not found. Please try again.");
                } else {
                  setErrMsg("Unable to fetch weather data. Try again later.");
                }
              }
                    const data = await response.json();
                    setMainData(data)
                    setWeatherData(data.weather[0].description)
                    setWeatherIcon( `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
                    setTempData(data.main.temp)
                    setCountry(countries.getName(data.sys.country, "en"))
            } catch (error) {
                    setError(error.message);
            } finally {
                    setLoading(false);
                    setCityName('');
            }
      };   
      fetchData();

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error}</p>;
      
    }

    

    return(
        <div className='main-container'>
          <div className='sub-container'>
            <h1 className='main-heading'>Current weather</h1>
            
              <form onSubmit={handleSubmit} className='form-container'>
                <div className='input-element-container'>
                  <input 
                    type="name" 
                    id="cityName" 
                    value={cityName}
                    onChange={onChangeCityName}
                    placeholder='Enter City Name'
                    className='input-element'
                  />
                  <MagnifyingGlass size={28} weight="light"/>
                  </div>
                <input type="submit" value="Enter" className='submit-button'/>
              </form>
            

            {data && (
              <div>
                {country && <div className='city-country-container'>Results for<span className='city-country-span'><h3>{data.name}, {country}</h3></span></div>}
                <div className='weather-info-container'>
                  <div className='weather-container'>
                      {weatherIcon && <img className='weather-icon' src={weatherIcon} alt={weatherData}/>}
                      {tempData && <p><span className='temp-span'>{tempData}</span>°C</p>}
                  </div>
                  <div><p className='weather-detail'>{weatherData}</p></div>
                </div>
              </div>
            )}

            
            {errMsg && <p>{errMsg}</p>}
            </div>
        </div>
    )

}

export default Weather