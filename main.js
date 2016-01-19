'use strict';


//global vars
var ref = new Firebase('https://jmmcontacts.firebaseio.com/');
var questionsRef = ref.child('questions');
var $template;
var $answerTemplate;

$(document).ready(function() {
  $('#test').click(addNewQuestion);
  $template = $('#cardtemplate');
  $answerTemplate = $('#answertemplate');
  $(document).on('click', '#promptAnswerQuestion', showQ);
  $(document).on('click', '#addanswer', addNewAnswer);
});



function showQ(){
  var questionKey = $(this).attr('data-key');
  var retrievedQuestion = questionsRef.child(questionKey).on('value', function(snap){
      var questionData = snap.val();
      var question = questionData.question;
      var date = questionData.date;
      var currentAnswers = questionData.answers;
      $('#questionTitle').text(question);
      $('#questionDate').text("asked on "+date);
      $('#addanswer').attr('data-key',questionKey);
      var $domAnswers = [];

      for (var prop in currentAnswers) {
        var answerBody = currentAnswers[prop].answer;
        var answerDate = currentAnswers[prop].date;
        var $newAnswerDiv = $answerTemplate.clone().removeClass('template');
        $newAnswerDiv.find('#answerbody').text(answerBody);
        $newAnswerDiv.find('#answerdate').text(answerDate);
        $domAnswers.push($newAnswerDiv);
      }
      $('#answerslist').append($domAnswers);
  });

}


function addNewAnswer(){
  var questionKey = $(this).attr('data-key');
  var answer = $('#answerinput').val();
  var date = moment().format('MM/DD/YYYY h:mm a');

  $('#newA')[0].reset();
  $('#answerQuestionModal').modal('toggle');

  questionsRef.child(questionKey).child('answers').push({
    answer: answer,
    date: date
  });
}


function addNewQuestion(){

  console.log('addNewQuestion was callled!!!!')
  var firstname = $('#firstname').val();
  var lastname = $('#lastname').val();
  var question = $('#questioninput').val();
  var date = moment().format('MM/DD/YYYY h:mm a');
  var answers = [];
  $('#newQ')[0].reset();
  $('#addQuestionModal').modal('toggle');

  questionsRef.push({
    firstname: firstname,
    lastname: lastname,
    question: question,
    date: date,
    answers: answers
  });
}


//LISTEN TO FIREBASE, REFLECT CHANGES

questionsRef.on('value', function(snapshot) {
  var $domQuestions = [];
    snapshot.forEach(function(childSnapshot) {
        var thisChild = childSnapshot.val();
        var key = childSnapshot.key();
        var firstname = thisChild.firstname;
        var lastname = thisChild.lastname;
        var date = thisChild.date;
        var question = thisChild.question;
        var $newDiv = $template.clone().removeClass('template');
        $newDiv.find('#name').text(firstname+" "+lastname);
        $newDiv.find('#date').text(date);
        $newDiv.find('#questionbody').text(question);
        $newDiv.find('#promptAnswerQuestion').attr('data-key', key);
        $domQuestions.push($newDiv);
    });
  $('#allCards').children().not('#newQuestionDiv').remove();
  $('#allCards').append($domQuestions);

});
