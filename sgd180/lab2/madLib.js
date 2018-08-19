function tellStory() {
  // Get variables & make strings
  var name1 = document.getElementById("txtName1").value;
  var name2 = document.getElementById("txtName2").value;
  var geol = document.getElementById("txtGeol").value;
  var verb = document.getElementById("txtVerb").value;
  var container = document.getElementById("txtContainer").value;
  var liquid = document.getElementById("txtLiquid").value;
  var bodyPart = document.getElementById("txtBodyPart").value;
  var gerund = document.getElementById("txtGerund").value;

  // Update story
  var story = document.getElementById("story");
  var storyText = name1 + " and " + name2 + " went up the " + geol + "<br>";
      storyText += "to " + verb + " a " + container + " of " + liquid + "<br>";
      storyText += name1 + " fell down and broke her " + bodyPart + "<br>";
      storyText += "and " + name2 + " came " + gerund + " after";

  story.innerHTML = storyText;

}
