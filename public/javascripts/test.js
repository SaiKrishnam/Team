/**
 * Created by Saikrishnam on 10/29/2015.
 */
console.log('gotch yaa!!');
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

function initAutocomplete() {
    // Create the search box and link it to the UI element.
    var input = document.getElementById('address');
    var searchBox = new google.maps.places.SearchBox(input);
    searchBox.addListener('places_changed',function(){
        var resultsArray = searchBox.getPlaces();
        var loc = resultsArray[0].geometry.location;
        var lat = resultsArray[0].geometry.location.lat();
        var lng = resultsArray[0].geometry.location.lng();
        var locObject = {lat:lat , lng:lng};
        console.log(locObject);
        localStorage.setItem('userEntry',JSON.stringify(locObject) );
        //parent.location = 'mapDisplay.ejs';

    });

}