const removeWhiteSpaces = (element) => {
  return element = element.trimStart().trimEnd();
}
const capitalise = (element) => {
  return `${element.charAt(0).toUpperCase()}${element.substring(1, element.length)}`
}
const findFirstName = (element) => {
  if (element.indexOf(" ") == -1) {
    return element
  } else {
    element = element.substring(0, element.indexOf(" "))
  }

  return element;
}


const getLengthOfName = element => findFirstName(element).length;


const getNickname = (element) => element.indexOf('"') ? element.substring(element.indexOf('"') + 1, element.lastIndexOf('"')) : null;
const getMiddleName = (element) => {
  const names = element.split(" ");
  // console.log(names.length);
  let middleName
  if (getNickname(element)) {
    names.splice(getNickname(element));
  } else if (names.length >= 2 && names[1].length >= 2) {
    middleName = names.slice(1, names.length - 1).join(" ");
  } else {
    middleName = undefined
  }
  return middleName
}

function checkFileExtension(element) {
  if (element.endsWith(".jpg")) {
    return "It ends with .jpg"
  } else if (element.endsWith(".png")) {
    return "It's a .png"
  } else {
    return `It ends with ${element[element.length-1]}, but why though?`
  }
}

function hidePassword(element) {

  return "*".repeat(element.length)
}


function capitaliseAfterGapsHyphen(element) {
  const arr = element.split(" ");
  const newSentence = [];
  arr.forEach(word => {
    if (word.includes("-")) {
      arr.splice(arr.indexOf(word), 1, word.split("-").map(capitalise).join("-"));
    }

    if (word !== " " || word !== "-") {
      let capitalisedWord = word.charAt(0).toUpperCase() + word.substring(1, word.length);
      newSentence.push(capitalisedWord);
    } else {
      newSentence.push(word);
    }
  });
  const capitalisedSentence = newSentence.join(" ");
  return capitalisedSentence
}





const lastName = (element) => {
  element = element.trimEnd()
  const arr = element.split(" ");
  return arr[arr.length - 1]
}