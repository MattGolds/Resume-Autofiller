
// Set event listeners
var choiceButtons = document.querySelectorAll('input[name="choiceSub"]');
if (choiceButtons) { choiceButtons.forEach((button) => {button.addEventListener('click',showChoice, false);});}

var infoButton = document.querySelector('#infoSub');
if (infoButton) {infoButton.addEventListener('click', updateUserInfo,false);}

var eduButton = document.querySelector('#eduSub');
if (eduButton) {eduButton.addEventListener('click', addEdu,false);}

var expButton = document.querySelector('#expSub');
if (expButton) {expButton.addEventListener('click', addJob,false);}

var cancelButtons = document.querySelectorAll('input[name="cancel"]');
if (cancelButtons) {
    cancelButtons.forEach((button) => {
        button.addEventListener('click', showMain,false);});
}
var overview = document.querySelector('#overview');
if (overview) {overview.addEventListener("click", function(e) {
    if(e.target && e.target.value == "Remove") {
        if (e.target.name == "removeEdu") {removeEducation(e.target.id);}
        else if (e.target.name == "removeExp") {removeExperience(e.target.id);}
        }});}

chrome.storage.local.clear();
function showChoice(event){
    var result = event.target.id;
    var label = event.target.value;
    var divs = document.querySelectorAll('div');
    if (divs) { divs.forEach((div) => {div.style.display = 'none';});}
    
    if (result =="userButton") {
        document.getElementById("choice").innerHTML = label;
        document.getElementById("info_form").style.display = 'block';
    }else if (result =="eduButton") {
        document.getElementById("choice").innerHTML = label;
        document.getElementById("add_edu_form").style.display = 'block';
    }else if (result == "jobButton") {
        document.getElementById("choice").innerHTML = label;
        document.getElementById("add_exp_form").style.display = 'block';
    }else if (result == "overviewButton") {
        document.getElementById("choice").innerHTML = label;
        document.getElementById("overview").style.display = 'block';
        showUserData();
    }else if (result == "settingsButton") {
        document.getElementById("choice").innerHTML = label;
        document.getElementById("overview").style.display = 'block';
        showUserData();
    }
 
}
function showMain(event){
    
    document.getElementById("main").style.display = 'block';
    document.getElementById("info_form").style.display = 'none';
    document.getElementById("add_edu_form").style.display = 'none';
    document.getElementById("add_exp_form").style.display = 'none';
    document.getElementById("overview").style.display = 'none';
    document.getElementById("choice").innerHTML = "";
    event.preventDefault();
}

function updateUserInfo(event){
    
   var info = {'fname':document.getElementById('fname').value,
                'lname':document.getElementById('lname').value,
                'email':document.getElementById('email').value};
        
    chrome.storage.local.set({'userinfo':info});
    document.getElementById("choice").innerHTML = "";     
   
    document.getElementById("main").style.display = 'block';
    document.getElementById("info_form").style.display = 'none';

}

function addEdu() {
    var edu = {'school':document.getElementById('school').value,
                'major':document.getElementById('major').value,
                'degree':document.getElementById('degree').value,
                'grad':document.getElementById('grad').value};
    chrome.storage.local.get('education',function(schools){
        console.log(schools);
        if (schools.education) {
            schools.education.push(edu);
        }else{
            schools.education = [edu];
        }
        document.getElementById("choice").innerHTML = schools; 
        chrome.storage.local.set(schools);
    });
    
    document.getElementById("choice").innerHTML = "";     
   
    document.getElementById("main").style.display = 'block';
    document.getElementById("add_edu_form").style.display = 'none';

}
function addJob() {
    var job = {'company':document.getElementById('company').value,
                'title':document.getElementById('title').value,
                'description':document.getElementById('desc').value,
                'start':document.getElementById('start').value,
                'end':document.getElementById('end').value};
    chrome.storage.local.get('experience',function(jobs){
        console.log(jobs);
        if (jobs.experience) {
            jobs.experience(job);
        }else{
            jobs.experience = [job];
        }
        chrome.storage.local.set(jobs);
    });
    
    document.getElementById("choice").innerHTML = "";     
   
    document.getElementById("main").style.display = 'block';
    document.getElementById("add_exp_form").style.display = 'none';
}

function removeEducation(edu) {
    chrome.storage.local.get('education',function(schools){
        if (schools.education) {
            var index = schools.education.indexOf(edu);
            if (index > -1) {
              schools.education.splice(index, 1);
            }  
            chrome.storage.local.set(schools);
    }});
    
}

function removeExperience(job) {
    chrome.storage.local.get('experience',function(jobs){
        if (jobs.experience) {
            var index = jobs.experience.indexOf(job);
            if (index > -1) {
              jobs.experience.splice(index, 1);
            }  
            chrome.storage.local.set(jobs);
            
    }});
    
}


function showUserData() {
    const div = document.getElementById("overview");
    var backButton = document.createElement('input');
    backButton.type = "button";
    backButton.value = "Back";
    backButton.addEventListener('click', showMain,false);
    div.appendChild(backButton);
    chrome.storage.local.get("userinfo", function(userInfo){
        userInfo = userInfo.userinfo;
        if (userInfo) {
             div.innerHTML = `<h3>Personal Information:</h3>
                        <b>Name:</b><p>${userInfo.fname} ${userInfo.lname}</p>
                        <b>Email:</b><p>${userInfo.email}</p>`;
            var editButton =  document.createElement('input');
            editButton.type = "button";
            editButton.id = "userButton";
            editButton.value = "Edit";
            editButton.addEventListener('click', showChoice,false);
            div.appendChild(editButton);
        }
       
    });
    
    chrome.storage.local.get("education", function(schools){
        console.log(schools.education);
        if (schools.education) {
            schools.education.forEach(function(school) {
                
                div.innerHTML += `<h3>Education:</h3>
                                <b>${school.school}</b>
                                <p>Field of Study - ${school.major}</p>
                                <p>Degree Type - ${school.degree}</p>
                                <p>Graduation Date - ${school.grad}</p>`;
                var removeButton =  document.createElement('input');
                removeButton.type = "button";
                removeButton.id = school.school;
                removeButton.name = "removeEdu";
                removeButton.value = "Remove";
                div.appendChild(removeButton);
        });}});
    chrome.storage.local.get("experience", function(jobs){
        if (jobs.experience) {
            jobs.experience.forEach(function(job) {
            
                div.innerHTML += `<h3>Work Experience:</h3>
                                <b>${job.company}</b>
                                <p>Position: ${job.title}</p>
                                <p>${job.start} - ${job.end}</p>
                                <p>Description:<br>${job.desc}</p>`;
                var removeButton =  document.createElement('input');
                removeButton.type = "button";
                removeButton.id = job.company;
                removeButton.name = "removeExp";
                removeButton.value = "Remove";
                div.appendChild(removeButton);
        });}});
    overview = document.querySelector('#overview');
    if (overview) {overview.addEventListener("click", function(e) {
        if(e.target && e.target.value == "Remove") {
            if (e.target.name == "removeEdu") {removeEducation(e.target.id);}
            else if (e.target.name == "removeExp") {removeExperience(e.target.id);}
            }});}
}