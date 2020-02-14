const capitalise = (element) => {
  return `${element.charAt(0).toUpperCase()}${element.substring(1, element.length)}`
}
const findFirstName = (element) => {
  element = element.trimStart()
  if (element.indexOf(" ") == -1) {
    return element
  } else {
    element = element.substring(0, element.indexOf(" "))
  }

  return element;
}


const getLengthOfName = element => findFirstName(element).length;


function getMiddleName(element) {
  const names = element.split(" ");
  let middleName
  if (names.length >= 2 && names[2].length >= 2) {
    middleName = names.slice(1, names.length - 1).join(" ");
  } else {
    middleName = "Middle name not found"
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