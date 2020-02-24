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
  isRavenclaw: false
}


function selectHTMLelements() {
  const HTML = {}
  HTML.labelsForSorting = document.querySelectorAll(".sorting label");
  HTML.labelsForFiltering = document.querySelectorAll(".filtering label");
  HTML.studentTemplate = document.querySelector(".studentItem").content;
  HTML.students = document.querySelector(".studentsList")
  HTML.totalStudents = document.querySelector(".totalStudents")

  return HTML;
}

function showSchoolStatistics() {

}


function init() {
  const studentsArr = [];
  const HTMLelements = selectHTMLelements();
  getStudentData(studentsArr);
  fetchBloodData(studentsArr);
  changeLabelsImages(HTMLelements.labelsForSorting, studentsArr);
  changeLabelsImages(HTMLelements.labelsForFiltering, studentsArr);
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
      allStudentsHTML[index].style.display = "block";
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



// for (let index = 0; index < allStudentsHTML.length; index++) {
//   for (let j = 0; j < array.length; j++) {
//     if (allStudentsHTML[index].querySelector(".studentName").textContent === array[j].firstName) {
//       allStudentsHTML[index].style.order = array.indexOf(array[j]);
//     }
//   }
// }
// }

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
  console.log(studentCard);
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
  selectHTMLelements().students.appendChild(cln);
}


// const studentTemplate = document.querySelector(".studentTemplate").content;
// const students = document.querySelector(".students");


// window.addEventListener("DOMContentLoaded", init);

// const Student = {
//   firstName: "",
//   lastName: "",
//   middleName: undefined,
//   nickName: undefined,
//   image: "",
//   house: ""
// }
// const studentsArr = [];


// function init() {
//   fetch("https://petlatkea.dk/2020/hogwarts/students.json")
//     .then(res => res.json())
//     .then(data =>
//       data.forEach(createStudentInfoCard)
//     ).then(() => {
//       studentsArr.forEach(student => {
//         createStudentCards(student, studentsArr);
//       });
//     })
//     .then(() => {
//       const themeOptions = document.querySelectorAll(".theme");
//       const themeOptionsArr = Array.from(themeOptions);
//       themeOptions.forEach(option => {
//         option.addEventListener("change", () => {
//           studentsArr[themeOptionsArr.indexOf(option)].house = selectedHouse();
//           const selectedStudentCard = document.querySelectorAll(".student")[
//             themeOptionsArr.indexOf(option)
//           ];
//           const selectedStudentObject = studentsArr[themeOptionsArr.indexOf(option)];
//           showStudentHouseAndModal(selectedStudentCard, selectedStudentObject);
//         });
//       });
//     })

// };



// function createStudentInfoCard(student) {
//   const fullNameWithoutWhitespaces = capitaliseAfterGapsHyphen(removeWhiteSpaces(student.fullname).toLowerCase())
//   const studentCard = Object.create(Student);
//   studentCard.firstName = findFirstName(fullNameWithoutWhitespaces);
//   studentCard.lastName = lastName(fullNameWithoutWhitespaces);
//   studentCard.middleName = getMiddleName(fullNameWithoutWhitespaces);
//   studentCard.nickName = capitalise(getNickname(fullNameWithoutWhitespaces))
//   studentCard.house = capitalise(removeWhiteSpaces(student.house).toLowerCase());
//   studentsArr.push(studentCard)
// }


// function selectedHouse() {
//   const selectedTheme = event.target;
//   return selectedTheme.value;
// }

// function getNames(student) {
//   let fullName;
//   if (student.nickName && student.middleName) {
//     fullName = `${student.firstName} Middle name ${student.middleName} Nick name ${student.nickName} ${student.lastName}`
//   } else if (student.nickName) {
//     fullName = `${student.firstName} Nick name ${student.nickName} ${student.lastName}`
//   } else if (student.middleName) {
//     fullName = `${student.firstName} Middle name ${student.middleName} ${student.lastName}`
//   } else {
//     fullName = `${student.firstName} ${student.lastName}`
//   }
//   return fullName;

// }

// function createStudentCards(student, data) {
//   const clnStudent = studentTemplate.cloneNode(true);
//   clnStudent.querySelector(".nameOftheStudent").textContent = `${student.firstName} ${student.lastName}`;
//   clnStudent.querySelector(".textStudentName").textContent = getNames(student);
//   clnStudent.querySelector(".number").textContent = data.indexOf(student) + 1;

//   showStudentHouseAndModal(clnStudent, student);
//   clnStudent.querySelectorAll(".theme option").forEach(option => {
//     if (option.value == student.house.toLowerCase()) {
//       option.selected = true;
//     }
//   });

//   students.appendChild(clnStudent);
// }

// function showHideElement(element, classToAdd, classtoRemove) {
//   element.classList.toggle(`${classToAdd}`);
//   element.classList.toggle(`${classtoRemove}`);
// }

// function showStudentHouseAndModal(clnStudent, student) {
//   clnStudent.querySelector(".house").textContent = student.house;
//   const modal = clnStudent.querySelector(".modal");
//   modal.dataset.crest = student.house.toLowerCase();
//   clnStudent.querySelector(".textStudentHouse").textContent = student.house;

//   clnStudent.querySelector(".mainStudentInfo").onclick = function () {
//     showHideElement(modal, "d-flex", "d-none");
//   };

//   clnStudent.querySelector(".close").onclick = function () {
//     showHideElement(modal, "d-flex", "d-none");
//   };
// }