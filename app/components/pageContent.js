import React from "react";
import Image from "./Image.js";


var content = {
    "mainPage" : <div><h1>Home</h1><Image src="../app/imgs/firstScreen1.png"/></div>,
    "timetable" : <div><h1>Timetable</h1><Image src="../app/imgs/userSchedule1.png"/></div>,
    "userProfile" : <div><h1>User Profile</h1><Image src="../app/imgs/userProfile1.png"/></div>,
    "feedback" : <div><h1>Feedback Forms</h1><Image src="../app/imgs/feedback2.png"/></div>,
    "coaches" : <div><h1>Coach Information</h1><Image src="../app/imgs/coaches1.png"/></div>
}

var labels = {
    "mainPage" : "Home",
    "timetable" : "Timetable",
    "userProfile" : "User Profile",
    "feedback" : "Feedback",
    "coaches" : "Coaches"
}

export default {"content" : content, "labels" : labels}
