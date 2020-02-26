window.addEventListener("DOMContentLoaded", init)

const Student = {
  firstName: "",
  lastName: "",
  middleName: undefined,
  nickName: undefined,
  image: "",
  house: "",
  bloodStatus: "",
  isPerfect: false,
  isInInquisitionalSquad: false,
  isExpelled: false,
  isSlytherin: false,
  isHufflepuff: false,
  isGryffindor: false,
  isRavenclaw: false,
  isStudent: true
}


function selectHTMLelements() {
  const HTML = {}
  HTML.allStatistics = document.querySelectorAll(".li");
  HTML.labelsForSorting = document.querySelectorAll(".sorting label");
  HTML.labelsForFiltering = document.querySelectorAll(".filtering label");
  HTML.studentTemplate = document.querySelector(".studentItem").content;
  HTML.students = document.querySelector(".studentsList");
  HTML.totalStudents = document.querySelector(".totalStudents");
  HTML.searchFieldInput = document.querySelector(".search");
  HTML.overlay = document.querySelector(".overlay");
  HTML.startBtn = document.querySelector(".startBtn");
  HTML.filterBtn = document.querySelector(".filterBtn");
  HTML.modalContainer = document.querySelector(".modalContainer");
  return HTML;
}

// Starting the website
function openHogwarts(startBtn, overlay, statisticsFacts, studentsArr) {
  startBtn.addEventListener("click", () => {
    setSchoolStatistics(statisticsFacts, studentsArr)
    overlay.dataset.opened = "open"
    setTimeout(() => {
      overlay.dataset.closed = "close"
    }, 2000);
  });
}


function showFilterSortOptions(btn) {
  btn.addEventListener("click", (event) => {
    if ((event.target).dataset.active === "active") {
      (event.target).dataset.active = "none";
    } else {
      (event.target).dataset.active = "active";
    }
  })
}

// 
function setSchoolStatistics(element, studentsArr) {
  element.forEach(fact => {
    let filtereedNumberResult = studentsArr.filter(student => student[fact.dataset.value])
    document.querySelector(`[data-value="${fact.dataset.value}"]`).textContent += filtereedNumberResult.length
  })

}



function searchStudent(element, array) {
  element.addEventListener("input", (event) => {
    const searchResult = array.filter(element => (element.firstName + element.lastName).toLowerCase().includes(event.target.value))
    displayNewOrder(searchResult);
  })
}


function init() {
  const studentsArr = [];
  const HTMLelements = selectHTMLelements();
  openHogwarts(HTMLelements.startBtn, HTMLelements.overlay, HTMLelements.allStatistics, studentsArr)
  searchStudent(HTMLelements.searchFieldInput, studentsArr)
  getStudentData(studentsArr);
  fetchBloodData(studentsArr);
  changeLabelsImages(HTMLelements.labelsForSorting, studentsArr);
  changeLabelsImages(HTMLelements.labelsForFiltering, studentsArr);
  showFilterSortOptions(HTMLelements.filterBtn)

}



function changeLabelsImages(inputLabels, studentsArr) {

  inputLabels.forEach(label => label.addEventListener("click", () => {
    label = event.target;
    inputLabels.forEach(label => label.dataset.status = " ");
    label.dataset.status = "checked";
    doFilterOrSort(label, studentsArr)
  }))
}


let filterArr;

function doFilterOrSort(label, studentsArr) {
  const ceckedInput = getCheckedInputValue(label);
  if (filterArr && label.dataset.action === "sort") {
    studentsArr = sortStudents(filterArr, ceckedInput)
  } else if (label.dataset.action === "sort") {
    studentsArr = sortStudents(studentsArr, ceckedInput)
  } else if (label.dataset.action === "filter") {
    filterArr = filterStudent(studentsArr, ceckedInput)
    studentsArr = filterArr;
  }
  displayNewOrder(studentsArr);

}




function getCheckedInputValue(label) {
  const inputField = label.previousElementSibling
  return inputField.dataset
}

function sortStudents(studentsArray, ceckedInput) {
  const sortBy = ceckedInput.property;
  const sortDirection = setSortingDirection(ceckedInput)
  const newArr = studentsArray.sort((a, b) => {
    const x = a[sortBy].toLowerCase();
    const y = b[sortBy].toLowerCase();
    return x < y ? -1 * sortDirection : 1 * sortDirection;
  })
  return newArr;
}


function filterStudent(studentsArray, ceckedInput) {
  let filteredStudent = studentsArray;
  if (ceckedInput.property === "all") {
    filteredStudent = studentsArray;
  } else {
    filteredStudent = studentsArray.filter(student => student[ceckedInput.property] === true);
  }
  return filteredStudent;
}


function setSortingDirection(inputField) {
  let directionValue;
  if (inputField.sortDirection === "asc") {
    inputField.sortDirection = "desc"
    directionValue = 1;
  } else if (inputField.sortDirection === "desc") {
    inputField.sortDirection = "asc"
    directionValue = -1;
  }
  return directionValue;
}


function displayNewOrder(array) {
  const allStudentsHTML = document.querySelectorAll(".student");
  if (allStudentsHTML.length === array.length) {
    for (let index = 0; index < allStudentsHTML.length; index++) {
      addStudentProperties(allStudentsHTML[index], array[index]);
      allStudentsHTML[index].style.display = "grid";
    }
  } else if (allStudentsHTML.length > array.length) {
    let difference = allStudentsHTML.length - array.length - 1;
    while (difference >= 0) {
      const elementIndex = array.length + difference
      allStudentsHTML[elementIndex].style.display = "none";
      difference--
    }
    for (let index = 0; index < array.length; index++) {
      addStudentProperties(allStudentsHTML[index], array[index]);
    }
  }
}


function getStudentData(studentsArr) {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(res => res.json())
    .then(data => data).then((data) => {
      data.forEach((student) => assignValuesToStudentObject(student, studentsArr));
      studentsArr.forEach(displayStudentListItems)
    })
}


function fetchBloodData(studentsArr) {
  fetch("https://petlatkea.dk/2020/hogwarts/families.json").then(res =>
    res.json()).then(data => {
    assignBlodStatus(data.half, studentsArr)

  })
}

function assignBlodStatus(bloodStatuses, students) {
  students.forEach(student => {
    if (bloodStatuses.includes(student.lastName)) {
      student.bloodStatus = "half"
    } else {
      student.bloodStatus = "pure"
    }
  })
}


function assignValuesToStudentObject(student, studentsArr) {
  const fullNameWithoutWhitespaces = capitaliseAfterGapsHyphen(removeWhiteSpaces(student.fullname).toLowerCase())
  const studentCard = Object.create(Student);
  studentCard.firstName = findFirstName(fullNameWithoutWhitespaces);
  studentCard.lastName = lastName(fullNameWithoutWhitespaces);
  studentCard.middleName = getMiddleName(fullNameWithoutWhitespaces);
  studentCard.nickName = capitalise(getNickname(fullNameWithoutWhitespaces))
  studentCard.house = capitalise(removeWhiteSpaces(student.house).toLowerCase());
  studentCard.image = `${studentCard.lastName.toLowerCase()}_${studentCard.firstName[0].toLowerCase()}.png`;
  if (studentCard.firstName.includes("t")) {
    studentCard.isPerfect = true;
  }

  if (studentCard.firstName.includes("h")) {
    studentCard.isInInquisitionalSquad = true;
  } else {
    studentCard.isInInquisitionalSquad = false;

  }
  setHouseValue(studentCard);
  studentsArr.push(studentCard)
}


function setHouseValue(studentCard) {
  studentCard["is" + studentCard.house] = true;
}

function addStudentProperties(element, student) {
  element.querySelector(".listNumber").textContent = 32;
  element.querySelector(".studentName").textContent = student.firstName;
  element.querySelector(".studentLastName").textContent = student.lastName;
  element.querySelector(".studentHouse").textContent = student.house;

}

function displayStudentListItems(student) {
  const cln = selectHTMLelements().studentTemplate.cloneNode(true);
  cln.querySelector(".student").onclick = function () {
    showModal(student)
  }
  addStudentProperties(cln, student)
  selectHTMLelements().students.appendChild(cln);
}

function showModal(student) {
  console.log(student);
  const modal = selectHTMLelements().modalContainer;
  modal.dataset.crest = student.house.toLowerCase();
  modal.querySelector(".studentImg").src = `./img/studentImages/${student.image}`;
  modal.querySelector(".studentName").textContent += student.firstName;
  modal.querySelector(".middleName").textContent += student.middleName;
  modal.querySelector(".nickName").textContent += student.nickName;
  modal.querySelector(".studentLastName").textContent += student.lastName;
  modal.querySelector(".house").textContent += student.house;
  modal.querySelector(".inquisitionalSquad").textContent += student.isInInquisitionalSquad;


}



function assignValuesToModal(student, modal) {
  modal.dataset.crest = student.house.toLowerCase();
}