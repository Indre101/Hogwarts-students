"use strict";

window.addEventListener("DOMContentLoaded", init);

const Student = {
  id: "",
  firstName: "",
  lastName: "",
  middleName: undefined,
  nickName: undefined,
  image: "",
  house: "",
  bloodStatus: "",
  gender: "",
  isPrefect: false,
  isInInquisitorialSquad: false,
  isExpelled: false,
  isSlytherin: false,
  isHufflepuff: false,
  isGryffindor: false,
  isRavenclaw: false,
  isStudent: true
};

function selectHTMLelements() {
  const HTML = {};
  HTML.allStatistics = document.querySelectorAll(".li");
  HTML.labelsForSorting = document.querySelectorAll(".sorting label");
  HTML.labelsForFiltering = document.querySelectorAll(".filtering label");
  HTML.studentTemplate = document.querySelector(".studentItem").content;
  HTML.students = document.querySelector(".studentsList");
  HTML.totalStudents = document.querySelector(".totalStudents");
  HTML.searchFieldInput = document.querySelector(".search");
  HTML.overlay = document.querySelector(".overlay");
  HTML.startBtn = document.querySelector(".startBtn");
  HTML.filterBtnIcon = document.querySelector(".filterBtn");
  HTML.modalContainer = document.querySelector(".modalContainer");
  HTML.expellBtn = document.querySelector(".expell");
  HTML.prefectInput = document.querySelector(".prefectInput").content;
  HTML.prefectsMessageContainer = document.querySelector(
    ".prefectsMessageContainer"
  );
  HTML.confirmPrefectChoice = document.querySelector(".confirmChoice");
  HTML.prefectInputs = document.querySelectorAll(".prefectInputContainer");
  return HTML;
}

// Starting the website
function openHogwarts(startBtn, overlay) {
  startBtn.addEventListener("click", () => {
    overlay.dataset.opened = "open";
    setTimeout(() => {
      overlay.dataset.closed = "close";
    }, 2000);
  });
}

function showFilterSortMenu(btn) {
  btn.addEventListener("click", event => {
    if (event.target.dataset.active === "active") {
      event.target.dataset.active = "none";
    } else {
      event.target.dataset.active = "active";
    }
  });
}

function searchStudent(element, array) {
  element.addEventListener("input", event => {
    const displayedStudents = document.querySelectorAll(".student");
    displayedStudents.forEach(student => {
      if (
        student.textContent
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ) {
        student.dataset.show = "show";
      } else {
        student.dataset.show = "noshow";
      }
    });
  });
}

let isHackHappening = false;
let addedMyself = false;

function init() {
  const studentsArr = [];
  const HTMLelements = selectHTMLelements();
  openHogwarts(HTMLelements.startBtn, HTMLelements.overlay);
  searchStudent(HTMLelements.searchFieldInput, studentsArr);
  getStudentData(studentsArr);
  changeLabelsImages(HTMLelements.labelsForSorting, studentsArr);
  changeLabelsImages(HTMLelements.labelsForFiltering, studentsArr);
  showFilterSortMenu(HTMLelements.filterBtnIcon);
}

function changeLabelsImages(inputLabels, studentsArr) {
  inputLabels.forEach(label =>
    label.addEventListener("click", () => {
      const studentList = selectHTMLelements().students;
      studentList.innerHTML = " ";
      label = event.target;
      inputLabels.forEach(label => (label.dataset.status = " "));

      label.dataset.status = "checked";
      doFilterOrSort(label, studentsArr);
    })
  );
}

let filterArr;

function doFilterOrSort(label, studentsArr) {
  const ceckedInput = getCheckedInputValue(label);
  if (filterArr && label.dataset.action === "sort") {
    studentsArr = sortStudents(filterArr, ceckedInput);
  } else if (label.dataset.action === "sort") {
    studentsArr = sortStudents(studentsArr, ceckedInput);
  } else if (label.dataset.action === "filter") {
    filterArr = filterStudent(studentsArr, ceckedInput);
    studentsArr = filterArr;
  }
  studentsArr.forEach(stud => {
    displayStudentListItems(stud, studentsArr);
  });
}

function getCheckedInputValue(label) {
  const inputField = label.previousElementSibling;
  return inputField.dataset;
}

function sortStudents(studentsArray, ceckedInput) {
  const sortBy = ceckedInput.property;
  const sortDirection = setSortingDirection(ceckedInput);
  const newArr = studentsArray.sort((a, b) => {
    const x = a[sortBy].toLowerCase();
    const y = b[sortBy].toLowerCase();
    return x < y ? -1 * sortDirection : 1 * sortDirection;
  });
  return newArr;
}

function filterStudent(studentsArray, ceckedInput) {
  let filteredStudent;

  if (ceckedInput.property === "isExpelled") {
    filteredStudent = studentsArray.filter(
      student => student.isExpelled === true
    );
  }else {
    filteredStudent = studentsArray
      .filter(student => student[ceckedInput.property] === true)
      .filter(student => student.isExpelled === false);
  }
  return filteredStudent;
}

function setSortingDirection(inputField) {
  let directionValue;
  if (inputField.sortDirection === "asc") {
    inputField.sortDirection = "desc";
    directionValue = 1;
  } else if (inputField.sortDirection === "desc") {
    inputField.sortDirection = "asc";
    directionValue = -1;
  }
  return directionValue;
}

function getStudentData(studentsArr) {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(res => res.json())
    .then(data => data)
    .then(data => {
      data.forEach(student =>
        assignValuesToStudentObject(student, studentsArr)
      );
      studentsArr.forEach(student => {
        displayStudentListItems(student, studentsArr);
      });
    })
    .then(data => {
      fetchBloodData(studentsArr);
    })
    .then(data => {
      setSchoolStatistics(studentsArr);
      students = studentsArr;
    });
}

let students;

const hackTheSystem = () => {
  isHackHappening = true;
  if (addedMyself === false) {
    addMyselfTotheStudents(students);
    setSchoolStatistics(students);
    addedMyself = true;
  }
};

document.querySelector(".hack").onclick = function() {
  hackTheSystem();
};

function addMyselfTotheStudents(studentsArr) {
  const studentList = selectHTMLelements().students;
  studentList.innerHTML = " ";
  const Indre = {
    fullname: 'Indre "Hackerman" Natalija Zygaityte',
    house: "Ravenclaw",
    gender: "girl",
    hackerman: true
  };
  assignValuesToStudentObject(Indre, studentsArr);
  studentsArr.forEach(student => displayStudentListItems(student, studentsArr));
}

function messStudentBlooddata(studentsArr) {
  if (isHackHappening) {
    studentsArr.forEach(student => {
      const bloodStatus = ["pure", "half"];
      student.bloodStatus = bloodStatus[Math.floor(Math.random() * 2)];
    });
  }
}

//
function setSchoolStatistics(studentsArr) {
  let stats = selectHTMLelements().allStatistics;
  stats.forEach(fact => {
    let filtereedNumberResult = studentsArr
      .filter(student => student[fact.dataset.value])
      .filter(student => student.isExpelled === false);
    document.querySelector(
      `[data-value="${fact.dataset.value}"] span`
    ).textContent = filtereedNumberResult.length;
    if (fact.dataset.value === "isExpelled") {
      const expelled = studentsArr.filter(
        student => student.isExpelled === true
      );
      document.querySelector(
        `[data-value="${fact.dataset.value}"] span`
      ).textContent = expelled.length;
    }
  });
}

function fetchBloodData(studentsArr) {
  fetch("https://petlatkea.dk/2020/hogwarts/families.json")
    .then(res => res.json())
    .then(data => {
      assignBlodStatus(data.half, studentsArr);
    });
}

function assignBlodStatus(bloodStatuses, students) {
  students.forEach(student => {
    if (bloodStatuses.includes(student.lastName)) {
      student.bloodStatus = "half";
    } else {
      student.bloodStatus = "pure";
    }
  });
}

function assignValuesToStudentObject(student, studentsArr) {
  const fullNameWithoutWhitespaces = capitaliseAfterGapsHyphen(
    removeWhiteSpaces(student.fullname).toLowerCase()
  );
  const studentCard = Object.create(Student);
  studentCard.id = studentsArr.length;
  studentCard.firstName = findFirstName(fullNameWithoutWhitespaces);
  studentCard.lastName = lastName(fullNameWithoutWhitespaces);
  studentCard.middleName = getMiddleName(fullNameWithoutWhitespaces);
  studentCard.nickName = capitalise(getNickname(fullNameWithoutWhitespaces));
  studentCard.house = capitalise(
    removeWhiteSpaces(student.house).toLowerCase()
  );
  studentCard.image = `${studentCard.id}.png`;
  studentCard.gender = student.gender;
  setHouseValue(studentCard);
  if (student.hackerman === true) {
    studentsArr.unshift(studentCard);
  } else {
    studentsArr.push(studentCard);
  }
}

function setHouseValue(studentCard) {
  studentCard["is" + studentCard.house] = true;
}

function addStudentProperties(element, student, studentsArr) {
  element.querySelector(".listNumber").textContent =
    studentsArr.indexOf(student) + 1;
  element.querySelector(".studentName").textContent = student.firstName;
  element.querySelector(".studentLastName").textContent = student.lastName;
  element.querySelector(".studentHouse").textContent = student.house;
}

function displayStudentListItems(student, studentsArr) {
  const cln = selectHTMLelements().studentTemplate.cloneNode(true);
  addStudentProperties(cln, student, studentsArr);
  cln.querySelector(".student").onclick = function() {
    showModal(student, studentsArr);
  };

  selectHTMLelements().students.appendChild(cln);
}

function showModal(student, studentsArr) {
  const modal = selectHTMLelements().modalContainer;
  modal.addEventListener("click", hideModal);
  modal.dataset.crest = student.house.toLowerCase();
  modal.querySelector(
    ".studentImg"
  ).src = `./img/studentImages/${student.image}`;
  modal.querySelector(".studentName span").textContent = student.firstName;

  modal.querySelector(".middleName span").textContent = student.middleName
    ? student.middleName
    : "none";
  modal.querySelector(".nickName span").textContent = student.nickName
    ? student.nickName
    : "none";
  modal.querySelector(".studentLastName span").textContent = student.lastName;
  modal.querySelector(".house span").textContent = student.house;
  messStudentBlooddata(studentsArr);
  modal.querySelector(".parentage span").textContent = student.bloodStatus;
  const expellBtn = modal.querySelector(".expell");
  modal.querySelector(".setAsPrefect").onclick = function() {
    checkIfEligibleForPrefect(student, studentsArr, modal);
  };

  modal.querySelector(".addToInquisitorialSquad").onclick = function() {
    if (isHackHappening) {
      setTimeout(() => {
        addRemoveFrominquisitorialSquad(student, modal);
      }, 1000);
    }
    addRemoveFrominquisitorialSquad(student, modal);
  };

  expellBtn.onclick = function() {
    if (student.id === 34) {
      document.querySelector("html").dataset.indre = "true";
      setTimeout(() => {
        document.querySelector("html").dataset.indre = "none";
      }, 2000);
    } else {
      expellStudent(student, modal);
      setSchoolStatistics(studentsArr);
    }
  };

  givePerfectPin(student, modal, studentsArr);
  showInquisitorialSquadStatus(student, modal);
  showIfExpelled(student, modal);
}

function setAsPrefect(student, modal) {
  if (student.isPrefect === true) {
    student.isPrefect = false;
  } else if (student.isPrefect === false) {
    student.isPrefect = true;
  }
  givePerfectPin(student, modal);
}

function givePerfectPin(student, modal) {
  modal.querySelector(".prefectPin").style.display = student.isPrefect
    ? "block"
    : "none";

  modal.querySelector(".prefectStatus span").textContent = student.isPrefect
    ? "yes"
    : "no";
  modal.querySelector(".setAsPrefect").textContent = student.isPrefect
    ? "Remove prefect status"
    : "Add as prefect";
}

function checkIfEligibleForPrefect(student, studentsArr, modal) {
  const HTML = selectHTMLelements();
  setAsPrefect(student, modal);
  const prefects = studentsArr.filter(prefect => prefect.isPrefect);
  const sameHousePrefects = prefects.filter(
    prefect => prefect.house === student.house
  );
  const sameGender = sameHousePrefects.filter(
    prefect => prefect.gender === student.gender
  );

  if (sameGender.length === 2 || sameHousePrefects.length > 2) {
    student.isPrefect = false;
    showPrefectMessage(HTML, sameGender, modal);
  }

  hidePrefectChoiceMessage(HTML);
}

function showPrefectMessage(HTML, sameHousePrefects, modal) {
  HTML.prefectsMessageContainer.dataset.show = "show";
  appedPrefectsOptions(sameHousePrefects, modal);
}

function hidePrefectChoiceMessage(HTML) {
  HTML.confirmPrefectChoice.onclick = function() {
    HTML.prefectsMessageContainer.dataset.show = "none";
  };
}

function appedPrefectsOptions(prefectsArr, modal) {
  document.querySelector(".prefectOptions").innerHTML = " ";
  const prefectInput = selectHTMLelements().prefectInput;

  prefectsArr.forEach(prefect => {
    const prefectItem = prefectInput.cloneNode(true);
    const inputOption = prefectItem.querySelector(".prefectInputContainer");
    changeTheLabelicons(inputOption, prefect);
    prefectItem.querySelector(
      ".prefectLabel"
    ).textContent = `${prefect.firstName} ${prefect.lastName}`;

    inputOption.onclick = function() {
      const prefectInputs = selectHTMLelements().prefectInputs;
      prefectInputs.forEach(
        prefectNames => (prefectNames.dataset.status = "none")
      );

      prefectsArr.forEach(prefectItem => {
        prefectItem.isPrefect = false;
        givePerfectPin(prefectItem, modal);
      });

      prefect.isPrefect = true;
      givePerfectPin(prefect, modal);
      inputOption.dataset.status = "checked";
    };

    givePerfectPin(prefect, modal);
    document.querySelector(".prefectOptions").appendChild(prefectItem);
  });
}

const changeTheLabelicons = (inputOption, prefect) => {
  inputOption.dataset.status = prefect.isPrefect ? "checked" : "none";
};

function addRemoveFrominquisitorialSquad(student, modal) {
  if (student.isInInquisitorialSquad === true) {
    student.isInInquisitorialSquad = false;
    showInquisitorialSquadStatus(student, modal);
  } else {
    checkIfStudentEligibleForISquad(student, modal);
  }
}

// function addToiquisitionalSquad(student) {
//   student.isInInquisitorialSquad = true;
// }

function checkIfStudentEligibleForISquad(student, modal) {
  if (student.bloodStatus === "pure" || student.house === "Slytherin") {
    student.isInInquisitorialSquad = true;
    modal.querySelector(".messagecontainer").dataset.show = "none";
  } else {
    student.isInInquisitorialSquad = false;
    showHideMessage(modal);
  }
  showInquisitorialSquadStatus(student, modal);
}

function showHideMessage(modal) {
  const messageContainer = modal.querySelector(".messagecontainer");
  messageContainer.dataset.show = "show";
  messageContainer.querySelector(".okBtn").addEventListener("click", () => {
    messageContainer.dataset.show = "none";
  });
}

function showInquisitorialSquadStatus(student, modal) {
  modal.querySelector(
    ".inquisitorialSquad span"
  ).textContent = student.isInInquisitorialSquad ? "yes" : "no";
  modal.querySelector(
    ".addToInquisitorialSquad"
  ).textContent = student.isInInquisitorialSquad
    ? "Remove from inquisitorial squad"
    : "Add to inquisitorial squad";
}

function expellStudent(student, modal) {
  student.isExpelled = true;
  student.isPrefect = false;
  showIfExpelled(student, modal);
  givePerfectPin(student, modal);
}

function showIfExpelled(student, modal) {
  if (student.isExpelled === true) {
    modal.querySelector(".modalImage").dataset.expelled = "expelled";
    modal.querySelector(".actions").dataset.expelled = "expelled";
  } else {
    modal.querySelector(".modalImage").dataset.expelled = "none";
    modal.querySelector(".actions").dataset.expelled = "none";
  }
}

function hideModal(event) {
  event.target.dataset.crest = "none";
}

function assignValuesToModal(student, modal) {
  modal.dataset.crest = student.house.toLowerCase();
}
