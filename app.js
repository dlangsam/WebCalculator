$(document).on('ready', function(){
	var userInMiddleOfTyping = false;
	var calcBrain = new Calculator();  
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
         $('.js-display').val(result); 
        
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
	printPending(){
		this.pending.print();
	}
	setOperand(number){
		this.accumulator = number;
	}
	executePendingBinaryOperation(){
		// console.log("Execute Pending");
		 if(this.pending){
		 	var symbol = this.pending.symbol; 
		 	// console.log(symbol);
            switch(symbol){
            	case "+": 
            			this.accumulator = Number(this.pending.number) + Number(this.accumulator);
            	 		break;
            	case "-":
            			this.accumulator = Number(this.pending.number) - Number(this.accumulator);
            			break;
            	case "*":
            			this.accumulator = Number(this.pending.number) * Number(this.accumulator);
            			break;
            	case "/":
            			this.accumulator = Number(this.pending.number) / Number(this.accumulator);
            			break;
            	 case "**":
            			this.accumulator = Number(this.pending.number) ** Number(this.accumulator);
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
			case "*":
			case "/":
			case "**":
					this.executePendingBinaryOperation();
                    this.pending = new Pending( String(this.accumulator), String(symbol));
					break;
			case "=":
					this.executePendingBinaryOperation();
					break;
			default: console.log("other");
		}
	
	}
}