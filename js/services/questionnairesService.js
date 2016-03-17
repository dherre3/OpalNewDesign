
var myApp = angular.module('MUHCApp');

myApp.service('Questionnaire', [function(){
	var service = {
		questions:[
			 { source: "ESAS", type: "scale", questionText: "<h2>How much <span style='color:darkmagenta'><strong>tiredness</strong></span> are you experiencing right now?</h2>", assesses: "tiredness", explanation: "Tiredness = lack of energy", max: "Worst possible tiredness", min: "No tiredness"},
			 { source: "ESAS", type: "scale", questionText: "<h2>How much <span style='color:darkmagenta'><strong>drowsiness</strong></span> are you experiencing right now?</h2>", assesses: "drowsiness", explanation: "Drowsiness = feeling sleepy", max: "Worst possible drowsiness", min: "No drowsiness"},
			 { source: "ESAS", type: "scale", questionText: "<h2>How much <span style='color:darkmagenta'><strong>nausea</strong></span> are you experiencing right now?</h2>", assesses: "nausea", explanation: "Nausea = feeling the need to vomit", max: "Worst possible nausea", min: "No nausea"},
			 { source: "ESAS", type: "scale", questionText: "<h2>How much <span style='color:darkmagenta'><strong>lack of appetite</strong></span> are you experiencing right now?</h2>", assesses: "lack of appetite", explanation: "Lack of appetite = not wanting to eat", max: "Worst possible lack of appetite", min: "No lack of appetite"},
			 { source: "ESAS", type: "scale", questionText: "<h2>How much <span style='color:darkmagenta'><strong>shortness of breath</strong></span> are you experiencing right now?</h2>", assesses: "shortness of breath", explanation: "Shortness of breath = difficulty breathing", max: "Worst possible shortness of breath", min: "No shortness of breath"},
			 { source: "ESAS", type: "scale", questionText: "<h2>How much <span style='color:darkmagenta'><strong>depression</strong></span> are you experiencing right now?</h2>", assesses: "anxiety", explanation: "Depression = feeling sad", max: "Worst possible depression", min: "No depression"},
			 { source: "ESAS", type: "scale", questionText: "<h2>How much <span style='color:darkmagenta'><strong>anxiety</strong></span> are you experiencing right now?</h2>", assesses: "anxiety", explanation: "Anxiety = feeling nervious", max: "Worst possible anxiety", min: "No anxiety"},
			 { source: "ESAS", type: "scale", questionText: "<h2>How much <span style='color:darkmagenta'><strong>wellbeing</strong></span> are you experiencing right now?</h2>", assesses: "wellbeing", explanation: "Wellbeing = how you feel overall", max: "Worst possible wellbeing", min: "Best wellbeing"},
			 { source: "ESAS", type: "scale", questionText: "<h2>How much <span style='color:darkmagenta'><strong>pain</strong></span> are you experiencing right now?</h2>", assesses: "pain", explanation: "Pain = physical hurt", max: "Worst possible pain", min: "No Pain"},
			 { source: "ESAS", type: "image", questionText: "<h2 style='font-size:20px'>Please indicate the <em>areas</em> that you are experiencing <span style='color:darkmagenta'><strong>pain</strong></span> or <span style='color:darkmagenta'><strong>discomfort</strong></span> by touching the locations on the image.</h2>", explanation: "Touch any areas that are causing pain or discomfort. The longer you leave your finger on the spot, the more intense the pain. Touch the spot again to clear.", assesses: "pain-front", imgSource:"./img/pain-front.png"},
			 { source: "ESAS", type: "image", questionText: "<h2 style='font-size:20px'>Please indicate the <em>areas</em> that you are experiencing <span style='color:darkmagenta'><strong>pain</strong></span> or <span style='color:darkmagenta'><strong>discomfort</strong></span> by touching the locations on the image.</h2>", explanation: "Touch any areas that are causing pain or discomfort. The longer you leave your finger on the spot, the more intense the pain. Touch the spot again to clear.", assesses: "pain-back", imgSource:"./img/pain-back.png"},
			 { source: "ESAS", type: "input", questionText: "<h2>Is there <span style='color:darkmagenta'><strong>anything else</strong></span> that concerns you <span style='font-size:12pt'>(Ex. constipation, rash, etc)</span>?</h2>", assesses: "other"}
		],

		// addSingleQuestion:function(singleQuestion){
		// 	this.questions.push(singleQuestion)
		// },

		// addQuestionARray:function(questionArray){
		// 	this.questions.join(questions)
		// },

		getQuestions:function(){
			return this.questions;
		},

		getMaxQuestions:function(){
			return this.questions.length;
		}
	}

	return service;
}]);
