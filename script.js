var req = new XMLHttpRequest();
const SUCCESS_CODE = 200;
const API_KEY = '31543fd642ee2a6f2bfb19c751903e38';
const search_icon = document.querySelector('.search_icon');
const kelvin_button = document.querySelector('#kelvin');
const celsius_button = document.querySelector('#celsius');
info_status = false;

document.addEventListener('keypress',function(e){
    if(e.key == 'Enter')
        search();
})

search_icon.addEventListener('click', function () {
    search();
});

function search(){
    const city_name = document.querySelector('#city_input').value.trim();
    update_city(city_name);
}

kelvin_button.addEventListener('click', function() {
    kelvin_button.disabled = true;
    celsius_button.disabled = false;
    updateFromButton();
  });
  
celsius_button.addEventListener('click', function() {
    celsius_button.disabled = true;
    kelvin_button.disabled = false;
    updateFromButton();
});

function updateFromButton(){
    // if(window.getComputedStyle(document.querySelector('#city_infos').display) == 'none')
    //     return

    let main_temp = document.querySelector('#main_temp_text').textContent;
    let max_temp = document.querySelector('#min_temp_text').textContent;
    let min_temp = document.querySelector('#max_temp_text').textContent;
    if(kelvin_button.disabled){
        document.querySelector('#main_temp').style.fontSize = '7rem';
        update_text_temps(celsiusToKelvin(parseFloat(main_temp)),celsiusToKelvin(parseFloat(min_temp)),celsiusToKelvin(parseFloat(max_temp)));
        return;
    }   
    update_text_temps(kelvinToCelsius(parseFloat(main_temp)),kelvinToCelsius(parseFloat(min_temp)),kelvinToCelsius(parseFloat(max_temp))); 
    document.querySelector('#main_temp').style.fontSize = '8rem';
}


function update_city(city_name){
    
    req.onloadend = function(){
        let resp = req.responseText;
        let city_json = JSON.parse(resp)
        
        if(city_json['cod'] != SUCCESS_CODE)
            handle_api_error(city_json);
        update_infos(city_json);
    }

    req.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q='+city_name+'&lang=pt_br&units=metric&appid='+API_KEY);
    req.send(null);
}

function handle_api_error(city_json){
    alert(city_json['code'])
}

function update_infos(city_json){
    update_city_name(city_json['name'],city_json['sys']['country']);
    update_temps(city_json['main']);
    update_description(city_json['weather'][0]['description']);
    update_conditions(city_json['sys']['sunrise'],city_json['wind']['speed']);
    update_color(city_json['main']['temp']);
    update_weather_icon(city_json['weather'][0]['icon']);
    update_image(city_json['weather'][0]['icon']);
}

function update_city_name(city,country){
    document.querySelector('#city_name').textContent = city+' ('+country+')'
}

function update_temps(city_json_main){
    let main_temp = Math.trunc(city_json_main['temp']);
    let min_temp = Math.trunc(city_json_main['temp_min']);
    let max_temp = Math.trunc(city_json_main['temp_max']);
    
    if(kelvin_button.disabled){
        update_text_temps(celsiusToKelvin(parseFloat(main_temp)),celsiusToKelvin(parseFloat(min_temp)),celsiusToKelvin(parseFloat(max_temp)));
        return;
    }
    update_text_temps(main_temp,min_temp,max_temp);
    return;
}

function update_text_temps(main_temp,min_temp,max_temp){
    document.querySelector('#main_temp_text').textContent = main_temp;
    document.querySelector('#min_temp_text').textContent = min_temp;
    document.querySelector('#max_temp_text').textContent = max_temp;
}

function celsiusToKelvin(celsius) {
    return Math.round(celsius + 273.15);
}

function kelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
  }

function update_description(description){
    document.querySelector('#city_weather_description').textContent = description;
}

function update_conditions(sunrise_stamp,wind_speed){
    document.querySelector('#sunrise_text').textContent = timestampToHours(sunrise_stamp);
    document.querySelector('#wind_text').textContent = metersPerSecondToKilometersPerHour(parseFloat(wind_speed))
}

function timestampToHours(timestamp) {
    // Crie um objeto Date a partir do timestamp (em milissegundos, portanto, multiplique por 1000).
    const date = new Date(timestamp * 1000);

    // Extraia as horas e minutos da data.
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Formate a hora em uma string legível.
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return formattedTime;
  }

function metersPerSecondToKilometersPerHour(mps) {
    const kph = mps * 3.6; 
    return kph.toFixed(1); 
}

function update_weather_icon(icon_code){
    weather_image = document.querySelector('#weather_image');
    weather_image.src = `https://openweathermap.org/img/wn/${icon_code}@2x.png`;
}

function update_color(main_temp) {
    let color = get_color(main_temp);
    document.body.style.backgroundColor=`hsl(${color},80%,50%)`;
}


function get_color(temp){
   
    temp=parseInt(temp);
    if(temp==0){
        temp=200;
    }
     if(temp<0){
        temp=240;
    }else if(temp>40){
       temp=360;
    }else{
        temp=(180 - ((180-60)*(temp / 30)));
    }
    return temp;
}

function update_image(weather_main_icon_code){
    bg_img = document.querySelector('#imagem_fundo');
    bg_img.src = `images/${weather_main_icon_code.substring(0,2)}.png`

}