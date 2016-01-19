'use strict';

//global vars
var ref = new Firebase('https://jmmcontacts.firebaseio.com/');
var questionsRef = ref.child('questions');
var $template;
var $answerTemplate;

$(document).ready(function() {
  $('#addNewQuestion').click(addNewQuestion);
  $template = $('#cardtemplate');
  $answerTemplate = $('#answertemplate');
  $(document).on('click', '#promptAnswerQuestion', showAnswerModal);
  $(document).on('click', '#addanswer', addNewAnswer);
  $('#answerQuestionModal').on('hide.bs.modal', answerModalClosed);
});

function answerModalClosed(){
  console.log('modal closed');
  var currentKey = $('#addanswer').data('key');
  questionsRef.child(currentKey).off();
}

function showAnswerModal(){
  var questionKey = $(this).attr('data-key');
  var currentQuestionRef = questionsRef.child(questionKey);

  currentQuestionRef.on('value', function(snap){
    var questionData = snap.val();

    $('#questionTitle').text(questionData.question);
    $('#questionDate').text("asked on " + questionData.date);
    $('#addanswer').attr('data-key', questionKey);

    currentQuestionRef.child('answers').once('value', function(answersSnap) {
      var $domAnswers = [];
      answersSnap.forEach(function(answerSnap){
        var answerObj = answerSnap.val();
        var $newAnswerDiv = $answerTemplate.clone().removeClass('template');
        $newAnswerDiv.children('.answerbody').text(answerObj.answer);
        $newAnswerDiv.children('.answerdate').text(answerObj.date);
        $domAnswers.push($newAnswerDiv);
      });
      $('#answerslist').empty().append($domAnswers);
    });
  });
};


function addNewAnswer(){
  var questionKey = $(this).attr('data-key');
  var answer = $('#answerinput').val();
  var date = moment().format('MM/DD/YYYY h:mm a');

  $('#answerInput').val('');

  questionsRef.child(questionKey).child('answers').push({
    answer: answer,
    date: date
  });
}


function addNewQuestion(){
  var firstname = $('#firstname').val();
  var lastname = $('#lastname').val();
  var question = $('#questioninput').val();
  var date = moment().format('MM/DD/YYYY h:mm a');
  $('#newQ')[0].reset();
  $('#addQuestionModal').modal('toggle');

  questionsRef.push({
    firstname: firstname,
    lastname: lastname,
    question: question,
    date: date
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
