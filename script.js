window.addEventListener("DOMContentLoaded", init)

const labelsForSorting = document.querySelectorAll(".sorting label");
const labelsForFiltering = document.querySelectorAll(".filtering label");

changeInputsImages(labelsForSorting)
changeInputsImages(labelsForFiltering)

function changeInputsImages(arr) {
  arr.forEach(label => label.addEventListener("click", () => {
    label = event.target
    arr.forEach(label => label.dataset.status = " ")
    label.dataset.status = "checked"
  }))
}


const HTML = {}

function init() {}



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