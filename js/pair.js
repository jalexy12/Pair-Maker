var data = localStorage.getItem("names");

if (data === null) {
	showInput();
}
else {
	showRandomizer();
}

function showInput() {
	$('.js-section').hide();
	$('.js-input').show();

	$('.js-input-form').on("keydown", "input", addInputField)
	$('.js-input-form').on("submit", saveNames)
}

function showRandomizer() {
	$('.js-section').hide();
	new Clipboard('.js-make-pairs', {
	    text: function(trigger) {
	        return trigger.getAttribute('data-pairs');
	    }
	});

	$(".js-make-pairs").on("click", firstClick)

	$('.js-randomizer').show();
}

function addInputField(event) {
	if (event.keyCode !== 13 && event.keyCode !== 9) {
		return
	}

	event.preventDefault();
	var $input = $(event.currentTarget);

	if (!$input.val()){
		$('.js-input-form').trigger("submit");
		return
	}
	var html = `
		<li>
			<input type="text">
		</li>
	`;

	var newItem = $(html)

	$(".js-input-list").append(newItem);
	newItem.find("input").focus();
}

function saveNames(event) {
	event.preventDefault();
	var $form = $(event.currentTarget);
	var $inputs = $form.find("input");
	var $names = $inputs.map(function getValue(i, input){
		return $(input).val();
	});
	var names = $names.toArray();
	names = names.filter(function removeEmpty(name) {
		return name
	});
	localStorage.setItem("names", JSON.stringify(names));
	showRandomizer();
}

function makePairs(students) {
	var loopLength = Math.floor(students.length/2);
	var pairs = [];
	$(".js-student-images").empty();
	for(var i = 0; i < loopLength; i++) {

		var firstInPair = students[Math.floor(Math.random()*students.length)];
		var students = students.filter(function(e){return e!==firstInPair});

		var secondInPair = students[Math.floor(Math.random()*students.length)];
		var students = students.filter(function(e){return e!==secondInPair});

		var html = `
			<div class="each-pair">
				<img class="first-student-img animated fadeInRight" data-id="${firstInPair}" src="http://dummyimage.com/250x250/126bbf/fff&text=${firstInPair}">
				<img class="second-student-img animated fadeInLeft" data-id="${secondInPair}" src="http://dummyimage.com/250x250/126bbf/fff&text=${secondInPair}">
			</div>
		`;

		pairs.push(`${firstInPair} with ${secondInPair}`);

		$(".js-student-images").append(html);
	}
	if (students.length > 0) {
		$(".js-student-images").children(":first").append(`<img class="third-student-img animated fadeInUp" data-id="${students[0]}" src="http://dummyimage.com/250x250/126bbf/fff&text=${students[0]}">`)
		var trio = pairs[0];
		pairs[0] = trio + " and " + students[0];
	}

	return pairs;
}

function copyPairs(pairs) {
	var pairsString = pairs.toString()
	pairsString = pairsString.replace(/,/g, "\n");
	$(".js-make-pairs").attr("data-pairs", pairsString);
}



function firstClick() {
	var data = localStorage.getItem("names");
	var students = JSON.parse(data);
	var pairs = makePairs(students);
	$(".js-make-pairs").text("Copy Pairs to Clipboard")
    $(".js-make-pairs").off('click').on('click', secondClick)
	copyPairs(pairs);
}

function secondClick() {
	$(".js-make-pairs").text("Redo the pairs");
    $(".js-make-pairs").off('click').on('click', firstClick);
}