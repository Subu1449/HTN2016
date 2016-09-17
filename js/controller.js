//var user = authenticateUser("iphone_subu") //is 10232d1226293e821dsafafdf138721223ez for subu's username
var username = "10232d1226293e821dsafafdf138721223ez"


// Store frame for motion functions
var previousFrame = null;
var paused = false;
var pauseOnGesture = false;
var BridgeIP = '';

// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: true};

// to use HMD mode:
// controllerOptions.optimizeHMD = true;

Leap.loop(controllerOptions, function(frame) {
  if (paused) {
    return; // Skip this update
  }

  // Display Hand object data
  var handOutput = document.getElementById("handData");
  var handString = "";
  if (frame.hands.length > 0) {
    for (var i = 0; i < frame.hands.length; i++) {
      var hand = frame.hands[i];

      handString += "<div style='width:300px; float:left; padding:5px'>";
      handString += "Grab strength: " + hand.grabStrength + "<br />";

      // IDs of pointables associated with this hand
      if (hand.pointables.length > 0) {
        var fingerIds = [];
        for (var j = 0; j < hand.pointables.length; j++) {
          var pointable = hand.pointables[j];
            fingerIds.push(pointable.id);
        }
        if (fingerIds.length > 0) {
          handString += "Fingers IDs: " + fingerIds.join(", ") + "<br />";
        }
      }

      handString += "</div>";
    }
  }
  else {
    handString += "No hands";
  }
  handOutput.innerHTML = handString;


  // Store frame for motion functions
  previousFrame = frame;
})

function vectorToString(vector, digits) {
  if (typeof digits === "undefined") {
    digits = 1;
  }
  return "(" + vector[0].toFixed(digits) + ", "
             + vector[1].toFixed(digits) + ", "
             + vector[2].toFixed(digits) + ")";
}


//We need to have a pause option because pausing helps remove delays if a user is experienceing them
//due to delays in the phillips hue API
function togglePause() {
  paused = !paused;
  if (paused) {
    document.getElementById("pause").innerText = "Resume";
  } else {
    document.getElementById("pause").innerText = "Pause";
  }
}

function pauseForGestures() {
  if (document.getElementById("pauseOnGesture").checked) {
    pauseOnGesture = true;
  } else {
    pauseOnGesture = false;
  }
}



// Philips hue ajax request
function authenticateUser(developer) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: "http://192.168.3.2/api/" + developer,
        headers: {"X-HTTP-Method-Override, Access-Control-Allow-Origin: *": "PUT"},
    });
}
 
//This is the main function to change the color of the light depending on the motion 
//attained from the leap motion. 
//This function is called inside the Leap.motion loop which gets activated everytime a new
//point is detected. 
//For now, We look at the grab strength attribute
function modifyLight(saturation, brightness, hue) {
    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: "http://192.168.3.2/api/10232d1226293e821dsafafdf138721223ez/lights/1/state",
        headers: {"X-HTTP-Method-Override, Access-Control-Allow-Origin: *": "PUT"},
        data: {"on":true, "sat":saturation, "bri":brightness,"hue":hue}
    });
}

/*
Get data every some time later. Basic call that gets schedule depending on what your Bridge connection
is with your Phillip Hue
 */
function SchedulesGetData()
{ // GET /api/username/schedules
  var self = this;
  var url = 'http://' + this.BridgeIP + '/api/' + this.Username + '/schedules';
  return $.get(url, function(data) {
    if (data) {
      self.Schedules = data;
    }
  });
};

/*
gets the main scenes from phillip hue depending on the main connection with the bridge
 */
function ScenesGetData()
{ // GET /api/username/scenes
  var self = this;
  var url = 'http://' + this.BridgeIP + '/api/' + this.Username + '/scenes';
  return $.get(url, function(data) {
    if (data) {
      self.Scenes = data;
    }
  });
};


/*
gets the main sensor data from phillip hue depending on the main connection with the bridge
 */
function SensorsGetData()
{ // GET /api/username/sensors
  var self = this;
  var url = 'http://' + this.BridgeIP + '/api/' + this.Username + '/sensors';
  return $.get(url, function(data) {
    if (data) {
      self.Sensors = data;
    }
  });
};
 
