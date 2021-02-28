"use strict";



document.addEventListener("DOMContentLoaded", start);



let content;
let bloodStatus;
let studentArray = [];
let actualStudentArray = [];
let expelledStudentArray = [];
let squadStudents = [];
let prefectStudents = [];
let searchStudents = [];
let isHacked = false;



const Student = {
    firstName: "",
    middleName: "",
    lastName: "",
    nickName: "",
    pictureLink: "",
    gender: "",
    house: "",
    bloodType : "",
    expelled: "",
    squad: false  
};

async function start() {
   
    const url = "https://petlatkea.dk/2021/hogwarts/students.json";
    const getUrl = await fetch(url);
    content = await getUrl.json();
    
    const urlTwo = "https://petlatkea.dk/2021/hogwarts/families.json";
    const getUrlFamilies = await fetch(urlTwo)
    bloodStatus = await getUrlFamilies.json();

    filterButtons();
    modalButtons();
    search();
    //loadData();
    createStudents();
    createStudentDiv(studentArray);
}

        //Sorting//

function sortArray() {
    let sortedArray = [];
    let sortBy = this.value;
    if(sortBy === "firstName"){
        sortedArray = actualStudentArray.sort(sortByFirstName);
    } else if (sortBy === "lastName"){
        sortedArray = actualStudentArray.sort(sortByLastName);
    } else {
        sortedArray = actualStudentArray.sort(sortByHouse);
    }
    createStudentDiv(sortedArray);
  }

  function sortByFirstName(a, b){
    if(a.firstName < b.firstName){
        return -1;
    } else {
        return 1;
    }
  }

  function sortByLastName(a, b){
    if(a.lastName < b.lastName){
        return -1;
    } else {
        return 1;
    }
}

function sortByHouse(a, b){
    if(a.house < b.house){
        return -1;
    } else {
        return 1;
    }
}

        //Popup//

function displayPopup(student){
  let modalId = document.getElementById("modal_id");
  modalId.className = "modal_content";
  document.getElementById("full_name_modal").innerHTML = student.firstName + " " + student.lastName;
  document.getElementById("student_image_modal").src = student.pictureLink;
  document.getElementById("first_name_modal").innerHTML = student.firstName;
  document.getElementById("last_name_modal").innerHTML = student.lastName;
  document.getElementById("middle_name_modal").innerHTML = student.middleName;
  document.getElementById("nick_name_modal").innerHTML = student.nickName;
  document.getElementById("student_expelled").innerHTML = student.expelled;
  document.getElementById("squad_modal").innerHTML = student.squad;
  
  if(student.squad === true){
    document.getElementById("squad_button").innerHTML = "Remove from squad";
  } else {
    document.getElementById("squad_button").innerHTML = "Add to squad";
  }
  

  document.getElementById("house_modal").innerHTML = student.house;
  document.querySelector(".modal_background").classList.remove("hide");
  
  let studentHouse = student.house;
  let houseCrest;
  
  switch(studentHouse){
       case "Gryffindor":
          houseCrest = "images/gryffindor.png";
          modalId.classList.add("gryffindor_background_modal");
          break;
        case "Hufflepuff":
            houseCrest = "images/hufflepuff.png";
            modalId.classList.add("hufflepuff_background_modal");
            break;
        case "Slytherin":
            houseCrest = "images/slytherin.png";
            modalId.classList.add("slytherin_background_modal");
            break;
        case "Ravenclaw":
            houseCrest = "images/ravenclaw.png";
            modalId.classList.add("ravenclaw_background_modal");
            break;
        default:
            console.log("No house matched");
  }
  document.getElementById("house_crest_modal").src = houseCrest;


  document.getElementById("blood_status_modal").innerHTML = student.bloodType;

  document.getElementById("expel_button").value = student.firstName;
  document.getElementById("squad_button").value = student.firstName;
  document.getElementById("prefect_button").value = student.firstName;


  document.getElementById("close_modal").addEventListener("click", function(){
    document.querySelector(".modal_background").classList.add("hide");
  });

}

function loadData(){
    
}

        //Create Student//

function createStudents(){
    content.forEach(s => {
        let fullName = s.fullname.trim();
        

        let firstName = fullName.substring(0, fullName.indexOf(" "));
        if(!fullName.includes(" ")){
            firstName = fullName.substring(0);
        }
        firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
       
        let nickName = "";
        let middleName = "";
        if(fullName.split(" ").length - 1 === 2){
            if(fullName.includes('"')){
                nickName = fullName.substring(fullName.indexOf('"') +1, fullName.lastIndexOf('"'));
            } else {
                let startIndex = fullName.indexOf(" ");
                let endIndex = fullName.lastIndexOf(" ");
                middleName = fullName.substring(startIndex +1 , endIndex);
                middleName = middleName.charAt(0).toUpperCase() + middleName.slice(1).toLowerCase();
            }
           
           
        }
        

        let namesAsArray = fullName.split(" ");
        let amountOfNames = namesAsArray.length;
        
        let lastName = "";
        if(amountOfNames > 1){
            lastName = namesAsArray[amountOfNames-1].toLowerCase();
            
            if(lastName.includes("-")){
                let indexOfHyphen = lastName.indexOf("-") + 1;
                lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1, indexOfHyphen) + lastName.charAt(indexOfHyphen).toUpperCase() + lastName.slice(indexOfHyphen + 1);
            } else {
                lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
            }
           
        }
        
      
        let studentGender = s.gender.trim();
        studentGender = studentGender.charAt(0).toUpperCase() + studentGender.slice(1).toLowerCase();
        let studentHouse = s.house.trim();
        studentHouse = studentHouse.charAt(0).toUpperCase() + studentHouse.slice(1).toLowerCase();
        let pictureLink = "studentspictures/silhouette.png";
        if(firstName === "Justin" || firstName === "Leanne"){
           
        } else {
            if(firstName === "Padma" || firstName === "Parvati"){
                const pictureLinkString = lastName.toLowerCase() + "_" + firstName.toLowerCase();
                pictureLink = "studentspictures/" + pictureLinkString + ".png";
            } else {
                const pictureLinkString = lastName.toLowerCase() + "_" + firstName.charAt(0).toLowerCase();
                pictureLink = "studentspictures/" + pictureLinkString + ".png";
            }
           
        }
       
                //Create student object//

        const student = Object.create(Student);
        student.firstName = firstName;
        student.middleName = middleName;
        student.lastName = lastName;
        student.nickName = nickName;
        student.house = studentHouse;
        student.gender = studentGender;
        student.pictureLink = pictureLink;

        if(bloodStatus.half.includes(lastName)){
            student.bloodType = "Half-Blood";
        } else if (bloodStatus.pure.includes(lastName)){
            student.bloodType = "Pure-Blood";
        } else {
            student.bloodType = "Muggle";
        }

        studentArray.push(student);     
        
    }); 
}

function modalButtons(){
    document.getElementById("expel_button").addEventListener("click", expelStudent);
    document.getElementById("squad_button").addEventListener("click", addRemoveSquad);
    //document.getElementById("prefect_button").addEventListener("click", addToPrefect);
   
}

        //Prefect
/*
function addToPrefect(){
    let prefectStudent = document.getElementById("prefect_button").value;
    let student;

    studentArray.forEach(element => {
        if(element.firstName === prefectStudent){
            student = element;
        }
    });
}
*/


        //Squad Members


function addRemoveSquad(){
    let activeStudent;
    let squadStudent = document.getElementById("squad_button").value;
    studentArray.forEach(element => {
        if(element.firstName === squadStudent){   
            activeStudent = element;
        }
    });
    let addOrRemove = document.getElementById("squad_button").innerHTML;
    if(addOrRemove === "Remove from squad"){
        removeFromSquad(activeStudent);
    } else {
        addToSquad(activeStudent);
        if(isHacked){
            setTimeout(function(){
                removeFromSquad(activeStudent);
                alert(activeStudent.firstName + " " + activeStudent.lastName + " removed from the squad");
            }, 7000);
            
        }
    }

        //Squad//
}        
function addToSquad(student){

    if(student.house === "Slytherin" || student.bloodType === "Pure-Blood"){
        squadStudents.push(student);
        student.squad = true;
        document.getElementById("squad_modal").innerHTML = "Now part of the squad";
    } else {
        document.getElementById("squad_modal").innerHTML = "Can't be part of the squad";
    }

} 

function removeFromSquad(student){
    
    student.squad = false;
    let indexToRemove = squadStudents.findIndex(element => element.firstName === student.firstName);
    squadStudents.splice(indexToRemove, 1);

}

        //Expel Student

function expelStudent(){
 
    let expelledStudent = document.getElementById("expel_button").value;
    let indexNumber = 0;

    if(expelledStudent === "Simone"){
        document.getElementById("student_expelled").innerHTML = "How dare you?!?!?!?!";
    } else {
        studentArray.forEach(element => {
            if(element.firstName === expelledStudent){
                expelledStudentArray.push(element);
                studentArray.splice(indexNumber, 1);
                let indexToRemove = actualStudentArray.findIndex(student => student.firstName === expelledStudent);
                actualStudentArray.splice(indexToRemove, 1);
                element.expelled = "EXPELLED!!!";
                document.getElementById("student_expelled").innerHTML = "EXPELLED!!!!"
                createStudentDiv(actualStudentArray);
                
            }
            indexNumber++;
        });
    }
    
    

}

        //Filter buttons

function filterButtons(){
    document.getElementById("filter_all").addEventListener("click", filter);
    document.getElementById("filter_gryffindor").addEventListener("click", filterGryffindor);
    document.getElementById("filter_ravenclaw").addEventListener("click", filterRavenclaw);
    document.getElementById("filter_hufflepuff").addEventListener("click", filterHufflepuff);
    document.getElementById("filter_slytherin").addEventListener("click", filterSlytherin);
    document.getElementById("show_expelled_button").addEventListener("click", showExpelledStudents);
    document.getElementById("show_squad_button").addEventListener("click", showSquadStudents);


    document.getElementById("sort_first_name").addEventListener("click", sortArray);
    document.getElementById("sort_last_name").addEventListener("click", sortArray);
    document.getElementById("sort_house").addEventListener("click", sortArray);
}

function showSquadStudents(){
    createStudentDiv(squadStudents);
}

function showExpelledStudents(){
    createStudentDiv(expelledStudentArray);
}

        //Search//

function search(){
    const searchBar = document.getElementById("search_bar");
    searchBar.addEventListener("input", studentSearch);
}

function studentSearch(searchInput){
    debugger;
    if(searchInput.target.value.length === 1){
        searchStudents = actualStudentArray;
    }

    if(searchInput.target.value === "voldemort"){
        
        hackTheSystem();
    }
   
    let searchList = []

searchStudents.forEach(student => {
    let included = isSearch(student, searchInput);
    if(included){
        searchList.push(student);
    }

});

    createStudentDiv(searchList);
}

function isSearch(student, searchInput){
    let fullName = student.firstName + " " + student.middleName + " " + student.lastName;
    if(fullName.toLowerCase().includes(searchInput.target.value)){
        return true;
    } else {
        return false;
    }
    
}
        //Hack//

function hackTheSystem(){
   console.log("HACKED !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
   isHacked = true;
   hackedStudent();
   hackedBlood();
}

function hackedStudent(){
    const student = Object.create(Student);
    student.firstName = "Simone";
    student.middleName = "Kimie";
    student.lastName = "Ziegler";
    student.nickName = '"Slayer of Mudbloods"';
    student.house = "Slytherin";
    student.pictureLink = "studentspictures/ziegler_s.jpg";
    student.bloodType = "Pure-Blood";
studentArray.unshift(student);
}

function hackedBlood(){
    studentArray.forEach(element => {

        if(element.bloodType === "Pure-Blood"){
            let halfBlood = 0;
            let muggle = 1;
            let pureBlood = 2;
            let randomNumber = Math.floor(Math.random() * 3);
            if(randomNumber === 0){
                element.bloodType = "Half-Blood";
            } else if(randomNumber === 1) {
                element.bloodType = "Muggle";
            } else {
                element.bloodType = "Pure-Blood";
            }
        } else{
            element.bloodType = "Pure-Blood";
        }
        
    });
}

        //Filter//

function filter(){
    createStudentDiv(studentArray);
}

function filterGryffindor(){
    let gryffindorStudents = [];
    gryffindorStudents = studentArray.filter(isGryffindor);
    createStudentDiv(gryffindorStudents);

}

function isGryffindor(student){
    if(student.house === "Gryffindor"){
        return true;
    } else {
        return false;
    }
}

function filterRavenclaw(){
    let ravenclawStudents = [];
    ravenclawStudents = studentArray.filter(isRavenclaw);
    createStudentDiv(ravenclawStudents);
}

function isRavenclaw(student){
    if(student.house === "Ravenclaw"){
        return true;
    } else {
        return false;
    }
}

function filterHufflepuff(){
    let hufflepuffStudents = [];
    hufflepuffStudents = studentArray.filter(isHufflepuff);
    createStudentDiv(hufflepuffStudents);
}

function isHufflepuff(student){
    if(student.house === "Hufflepuff"){
        return true;
    } else {
        return false;
    }
}

function filterSlytherin(){
    let slytherinStudents = [];
    slytherinStudents = studentArray.filter(isSlytherin);
    createStudentDiv(slytherinStudents);
}

function isSlytherin(student){
    if(student.house === "Slytherin"){
        return true;
    } else {
        return false;
    }
}



function createStudentDiv(studentList){
    actualStudentArray = [];
    document.getElementById("listview").innerHTML = "";
    let i;
    for(i = 0; i < studentList.length; i++){
        
        let activeStudent = studentList[i];
        const listView = document.getElementById("listview");
        const div = document.createElement("div");
        div.classList.add("student");
        div.addEventListener("click", function(){
            displayPopup(activeStudent);
        });
        listView.appendChild(div);
        createImgElement(activeStudent, i);
        createFullNameElement(activeStudent, i);
        actualStudentArray.push(activeStudent);
    }
   
    document.getElementById("number_of_students").innerHTML = "Displaying " + actualStudentArray.length + " students";
    
}

function createImgElement(student, indexNumber){
    const studentList = document.getElementsByClassName("student")[indexNumber];
    const img = document.createElement("img");
     img.src = student.pictureLink;
     if(student.house === "Gryffindor"){
        img.classList.add("gryffindor_picture_shadow");
    } else if (student.house === "Hufflepuff"){
        img.classList.add("hufflepuff_picture_shadow");
    } else if (student.house === "Ravenclaw"){
        img.classList.add("ravenclaw_picture_shadow");
    } else{
        img.classList.add("slytherin_picture_shadow");
    }
     studentList.appendChild(img);
}

function createFullNameElement(student, indexNumber){
    const studentList = document.getElementsByClassName("student")[indexNumber];
    const p = document.createElement("p");
    if(student.house === "Gryffindor"){
        p.classList.add("gryffindor_p_shadow");
    } else if (student.house === "Hufflepuff"){
        p.classList.add("hufflepuff_p_shadow");
    } else if (student.house === "Ravenclaw"){
        p.classList.add("ravenclaw_p_shadow");
    } else{
        p.classList.add("slytherin_p_shadow");
    }
    if(student.middleName === undefined){
        p.innerHTML = student.firstName + " " + student.lastName;
    } else {
        p.innerHTML = student.firstName + " " + student.middleName + " " + student.lastName;
    }
    
    
    studentList.appendChild(p);
}

function createNickNameElement(){
    const studentList = document.getElementById("student_template");
    const p = document.createElement("p");
    p.innerHTML = "N/A";
    studentList.appendChild(p);
}

function createHouseElement(){
    const studentList = document.getElementById("student_template");
    const p = document.createElement("p");
    p.innerHTML = "Gryffindor";
    studentList.appendChild(p);
}

function createBloodElement(){
    const studentList = document.getElementById("student_template");
    const p = document.createElement("p");
    p.innerHTML = "Half-Blood";
    studentList.appendChild(p);
}

