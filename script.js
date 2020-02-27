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
  HTML.expellBtn = document.querySelector(".expell");
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
function setSchoolStatistics(statisticsFacts, studentsArr) {
  statisticsFacts.forEach(fact => {
    let filtereedNumberResult = studentsArr.filter(student => student[fact.dataset.value])
    document.querySelector(`[data-value="${fact.dataset.value}"]`).textContent += filtereedNumberResult.length
  })

}



function searchStudent(element, array) {
  element.addEventListener("input", (event) => {
    const displayedStudents = document.querySelectorAll(".student");
    displayedStudents.forEach(student => {
      if (student.textContent.toLowerCase().includes(event.target.value.toLowerCase())) {
        student.dataset.show = "show"
      } else {
        student.dataset.show = "noshow"
      }
    });
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
    const studentList = selectHTMLelements().students;
    console.log(studentList);
    studentList.innerHTML = " ";
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
  } else
  if (label.dataset.action === "sort") {
    studentsArr = sortStudents(studentsArr, ceckedInput)
  } else if (label.dataset.action === "filter") {
    filterArr = filterStudent(studentsArr, ceckedInput)
    studentsArr = filterArr;
  }
  studentsArr.forEach(stud => {
    displayStudentListItems(stud)
  });

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

  addStudentProperties(cln, student)

  cln.querySelector(".student").onclick = function () {
    showModal(student)
  }

  selectHTMLelements().students.appendChild(cln);

}



function showModal(student) {
  const modal = selectHTMLelements().modalContainer;
  modal.addEventListener("click", hideModal)
  modal.dataset.crest = student.house.toLowerCase();
  modal.querySelector(".studentImg").src = `./img/studentImages/${student.image}`;
  modal.querySelector(".studentName").textContent = student.firstName;
  modal.querySelector(".middleName").textContent = `Middle name: ${student.middleName ? student.middleName : "none"}`;
  modal.querySelector(".nickName").textContent = `Nick name: ${student.nickName ? student.nickName : "none"}`;
  modal.querySelector(".studentLastName").textContent = `Last name: ${student.lastName}`;
  modal.querySelector(".house").textContent = `House: ${student.house}`;
  modal.querySelector(".parentage").textContent = `Parentage: ${student.bloodStatus}`;
  modal.querySelector(".inquisitionaSquad").onclick = function () {
    checkIfStudentEligibleForISquad(student, modal);
  }
  modal.querySelector(".expell").onclick = function () {
    expellStudent(student);
    showIfExpelled(student, modal)
  }
  showInquistionalSquadStatus(student, modal);
  showIfExpelled(student, modal)
  setstudentAsAperfect(modal, student)
}



function addToiquisitionalSquad(student) {
  student.isInInquisitionalSquad = true;

}

function checkIfStudentEligibleForISquad(student, modal) {
  if (student.bloodStatus === "pure" || student.house === "Slytherin") {
    student.isInInquisitionalSquad = true;
    modal.querySelector(".messagecontainer").dataset.show = "none";

  } else {
    student.isInInquisitionalSquad = false;
    showHideMessage(modal)

  }
  showInquistionalSquadStatus(student, modal)
}


function showHideMessage(modal) {
  const messageContainer = modal.querySelector(".messagecontainer");
  messageContainer.dataset.show = "show";
  modal.querySelector(".okBtn").addEventListener("click", () => {
    messageContainer.dataset.show = "none";
  })
}


function showInquistionalSquadStatus(student, modal) {
  modal.querySelector(".inquisitionalSquad").textContent = `Member of inquisitional squad: ${student.isInInquisitionalSquad ? "yes" : "no"}`;
}



let expelledStudentCount = 0;

function updatedExpelledStudentNumber() {
  expelledStudentCount += 1
  document.querySelector(".isExpelled").textContent = `Number of expelled: ${expelledStudentCount}`;
}

function expellStudent(student) {
  student.isExpelled = true;
  updatedExpelledStudentNumber()
}

function showIfExpelled(student, modal) {
  if (student.isExpelled === true) {
    modal.querySelector(".modalImage").dataset.expelled = "expelled";
    modal.querySelector(".expell").dataset.clicked = "true";
  } else {
    modal.querySelector(".modalImage").dataset.expelled = "none";
    modal.querySelector(".expell").dataset.clicked = "none";
  }
}





// function addToiquisitionalSquad(student) {
//   if (student.isExpelled === true) {
//     modal.querySelector(".modalImage").dataset.expelled = "expelled";
//     modal.querySelector(".expell").dataset.clicked = "true";
//   } else {
//     modal.querySelector(".modalImage").dataset.expelled = "none";
//     modal.querySelector(".expell").dataset.clicked = "none";
//   }
// }

function hideModal(event) {
  event.target.dataset.crest = "none";

}

function setstudentAsAperfect(modalStyle, student) {
  // console.log(modalStyle.getPropertyValue('--perfect-bg-image'));
  if (!student.isPerfect) {
    modalStyle.style.setProperty('--perfect-bg-image', "none");
  } else {

    return true;
  }
}



function assignValuesToModal(student, modal) {
  modal.dataset.crest = student.house.toLowerCase();
}