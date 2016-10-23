$(document).on('ready', function(){

	var userInMiddleOfTyping = false;
	var calcBrain = new Calculator();
	var savedCalcsArray = [];
	var prev = 0;
	loadCalculations();
	function loadCalculations(){
		//window.localStorage.setItem("saved-calculations", "");
		if (window.localStorage.getItem("saved-calculations")){
    		var savedCalcs = window.localStorage.getItem("saved-calculations");
    		console.log(savedCalcs);
    		savedCalcsArray = savedCalcs.split(",");
    		savedCalcsArray.forEach(function(calc){
    			console.log(calc);
    		});
    		prev = savedCalcsArray.length; 
    		console.log(savedCalcsArray);
  		}
	}



	$('.js-digit').on('click', function(){
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
		var symbol = $(this).text();
		console.log(symbol + " clicked");
		if(userInMiddleOfTyping){
            calcBrain.setOperand($('.js-display').val());
        }
        userInMiddleOfTyping = false;        
        calcBrain.performOperation(symbol);

        
        var result = calcBrain.result();
        var desc = calcBrain.description;
         $('.js-display').val(result); 
          $('.js-desc').val(desc); 


        if(calcBrain.isCompleteCalculation()){
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
        }
        
	});

	$('.js-previous').on('click', function(){
		if(savedCalcsArray.length){
			if(prev ===0 ){
				prev = savedCalcsArray.length
			}
			prev = prev - 1;
		 	$('.js-desc').val(savedCalcsArray[prev]); 
		}else{
			$('.js-desc').val("No past calculations available");
		}
	});


}); 



class Pending{
	constructor(n, s){		
		this._number = n; 
		this._symbol = s;
	}
	get number(){
		return this._number;
	}
	get symbol(){
		return this._symbol; 
	}
	print(){
		console.log("Number: " + this._number +
		 " Symbol: " + this._symbol);
	}
}


class Calculator{
	constructor(){
		var _accumulator = 0.0;
		var _pending = null; 
		var _afterEqual = false;
		this._internalProgram = []; 
	}
	result(){
		return this.accumulator; 
	}
	set pending(pending){
		this._pending = pending; 
	}
	get pending(){
		return this._pending; 
	}
	set internalProgram(internalProgram){
		this._internalProgram = internalProgram; 
	}
	get internalProgram(){
		return this._internalProgram; 
	}
	pushToProgram(x){
		this._internalProgram.push(x);
	}
	get description(){
		var desc = "";
		this.internalProgram.forEach(function(x){
			desc += x;
		});
		return desc;
	}
	printPending(){
		this.pending.print();
	}
	setOperand(number){
		this.accumulator = number;
		
		this.pushToProgram(number);
	}
	executeUnaryOperation(symbol){

        switch(symbol){
        	case "√":
        		this.accumulator = new Decimal(String(this.accumulator)).pow(".5");
        		break;
        	case "x²":
        		this.accumulator = new Decimal(String(this.accumulator)).pow(2);
        		break;
        	default:
        		break;

        }

	}
	executePendingBinaryOperation(){
		 if(this.pending){
		 	var symbol = this.pending.symbol; 
            switch(symbol){
            	case "+": 
            			this.accumulator = Number(this.pending.number) + Number(this.accumulator);
            	 		break;
            	case "-":
            			this.accumulator = Number(this.pending.number) - Number(this.accumulator);
            			break;
            	case "×":
            			this.accumulator = Number(this.pending.number) * Number(this.accumulator);
            			break;
            	case "÷":
            			this.accumulator = Number(this.pending.number) / Number(this.accumulator);
            			break;
            	 case "xⁿ":
            			this.accumulator = Math.pow(Number(this.pending.number),Number(this.accumulator));
            			break;
            	default: 
            			console.log("here");
            			break;
            }
            this.pending = null;
            
        }
	}
	performOperation(symbol){
		switch(symbol){
			case "+": 	
			case "-":
			case "×":
			case "÷":
			case "xⁿ":
					this.executePendingBinaryOperation();
                    this.pending = new Pending( (this.accumulator),(symbol));
                    this.afterEqual = false;
                    console.log(this.internalProgram);
                    this.pushToProgram(symbol);
					break;
			case "√":
			case "x²":
				 	this.executeUnaryOperation(symbol);
				 	this.afterEqual = true;
				 	this.pushToProgram(symbol);
				 	break; 
			case "=":				
					this.executePendingBinaryOperation();
					this.afterEqual = true;

					break;
			default: console.log("other");
		}
	
	}
	isCompleteCalculation(){
		var isComplete = this.afterEqual && this.pending === null;  
		if(isComplete){
			this.internalProgram = [];
		}
		return isComplete;
	}
}