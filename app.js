

$(document).on('ready', function(){

	var digits = 10; //number of decimal digits to display in the result
	var userInMiddleOfTyping = false;
	var calcBrain = new Calculator();
	var savedCalcsArray = []; //array to store past 10 calculations
	var prev = 0;//index to keep track of which previous calculation to store
	loadCalculations();

	//method to read in and store all the past calculations
	//store in local storage so they are not lost on refresh;
	function loadCalculations(){
		if (window.localStorage.getItem("saved-calculations")){
    		var savedCalcs = window.localStorage.getItem("saved-calculations");		
    		savedCalcsArray = savedCalcs.split(",");
    		savedCalcsArray.forEach(function(calc){
    			console.log(calc);
    		});
    		prev = savedCalcsArray.length;   	
  		}
	}
	function setDisplayResult(){
		var result = calcBrain.result();



        //Once I get the result I am rounding to 10 digits and then calling toFixed 
        // to truncating at the 10th digit. I then round again so that any extra zeros 
        // that may have been added by the toFixed method are removed.
        var resultDisplayed = new BigNumber(result).round(digits);
        resultDisplayed = new BigNumber(resultDisplayed).toFixed(digits);
        resultDisplayed = new BigNumber(resultDisplayed).round(digits);
         $('.js-display').val(resultDisplayed); 
	}



	//Any time a digit is clicked update the display
	//The userInMiddleOfTyping makes sure only one decimal can be added
	$('.js-digit').on('click', function(){
		prev = savedCalcsArray.length
		var digit = $(this).text();
		console.log(digit + " clicked");
		if(userInMiddleOfTyping){
             var textCurrentlyInDisplay = $('.js-display').val();
             if(textCurrentlyInDisplay.includes(".") && digit === "." ){return;}
            $('.js-display').val(textCurrentlyInDisplay + digit);
        }else{
            if (digit === "."){
                 $('.js-display').val("0.");
            }else{
                $('.js-display').val(digit); 
            }
        }
        userInMiddleOfTyping = true;
	});


	$('.js-operation').on('click', function(){
		prev = prev + 1; 
		var symbol = $(this).text();
		console.log(symbol + " clicked");
		if(userInMiddleOfTyping){
            calcBrain.setOperand($('.js-display').val());
        }
        userInMiddleOfTyping = false;        
        calcBrain.performOperation(symbol); 
        
        var desc = calcBrain.description;
         $('.js-desc').val(desc); 
         setDisplayResult();

         //If a full calcution has been made (either user presses equal or a unary calc was called and
         // there is no pending calculation) then save the calculation 
         //If there are already 10 calculations saved, pop off the oldest one (index 0) and push the new
         //one onto the end of the array
        if(desc !== "" && calcBrain.isCompleteCalculation()){
        	console.log("Attempting to save data");
        	if(savedCalcsArray.length  === 10){
        		savedCalcsArray.shift();
        	}
        	savedCalcsArray.push(desc);
        	var savedCalcs = "";
        	savedCalcsArray.forEach(function(savedCalc){
        		savedCalcs += "," + savedCalc;
        	});
        	savedCalcs = savedCalcs.substring(1);
        	console.log(savedCalcsArray);
        	prev = savedCalcsArray.length; 
			window.localStorage.setItem("saved-calculations", savedCalcs);
			prev = prev - 1; 
        }

        //The past 10 calculations will be saved unless the user presses AC(all clear)
        if($(this).hasClass("js-allclear")){
        	savedCalcsArray = [];
        	window.localStorage.setItem("saved-calculations", "");
        }
        
        
	});
	//each time the previous button is clicked show a previous function
	//prev starts at the length of the array each time a new calculation is saved
	//every time the button is pressed the index decreases so that you can loop through
	//all 10 calculations
	$('.js-previous').on('click', function(){
		if(savedCalcsArray.length){
			if(prev ===0 ){
				prev = savedCalcsArray.length
			}
			prev = prev - 1;
			var pastCalc = savedCalcsArray[prev];
			calcBrain.redoCalc(pastCalc); 
		 	$('.js-desc').val(pastCalc); 
		 	setDisplayResult(); 
		}else{
			$('.js-desc').val("No past calculations available");
		}

	});


}); 



