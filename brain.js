class Calculator{
	constructor(){
		var _accumulator = 0;
		var _pending = null; 
		var _afterEqual = false;
		var _tempResult = null;
		var _enteredDigit = false; 
		this._internalProgram = []; 

		this.clear();
	}
	result(){
		return this.accumulator; 
	}
	set tempResult(tempResult){
		this._tempResult = tempResult; 
	}
	get tempResult(){
		return this._tempResult; 
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
			desc += " " + x;
		});
		return desc.substring(1);;
	}
	printPending(){
		this.pending.print();
	}
	setOperand(number){
		this.accumulator = number;	
		this.pushToProgram(number);
		//keep track of if the last thing the user did was enter a number
		this.enteredDigit = true; 
	}
	executeUnaryOperation(symbol){
		//Only save a temporary result if in the middle of a pending calculation
		if(!this.tempResult && this.pending){
			this.tempResult = new temporaryCalculation(0, []);
		}
		if(this.enteredDigit && this.pending){
			this.tempResult.pushToProgram(this.accumulator);
		}
        switch(symbol){
        	case "√":
        		this.accumulator = new BigNumber(this.accumulator).sqrt();
        		break;
        	case "x²":
        		this.accumulator = new BigNumber(this.accumulator).pow(2);
        		break;
        	case "x⁻¹":
        		this.accumulator = new BigNumber(this.accumulator).pow(-1);
        		break;
        	case "∓":
        		this.accumulator = new BigNumber(this.accumulator).neg();
        		break;
        	default:
        		break;

        }
        //Only save a temporary result if in the middle of a pending calculation
        if(this.pending){
        	this.tempResult.pushToProgram(symbol);	
        	this.tempResult.result = this.accumulator;
        	console.log(this.tempResult.internalProgram); 
    	}

	}
	executePendingBinaryOperation(){
		//If a unary calculation was performed during a pending calculation but 
		//then another number is typed in, remove the saved unary calculation data
		 if(this.tempResult && this.tempResult.result != this.accumulator){
		 	console.log("Removing part of internal program");
		 	//how to know how what to remove:
		 	var fullLength = this.internalProgram.length;
		 	var tempLength = this.tempResult.internalProgram.length;
		 	this.internalProgram.splice( fullLength - tempLength - 1, tempLength ); 	
		 }
		 if(this.pending){
		 	var symbol = this.pending.symbol; 
            switch(symbol){
            	case "+": 
            			this.accumulator = new BigNumber(this.pending.number).plus(new BigNumber(this.accumulator));
            	 		break;
            	case "-":
            			this.accumulator = new BigNumber(this.pending.number).minus(new BigNumber(this.accumulator));
            			break;
            	case "×":
            			this.accumulator = new BigNumber(this.pending.number).times(new BigNumber(this.accumulator));
            			break;
            	case "÷":
            			this.accumulator = new BigNumber(this.pending.number).div(new BigNumber(this.accumulator));
            			break;
            	 case "xⁿ":
            			this.accumulator = new BigNumber(this.pending.number).pow( new BigNumber(this.accumulator));		
            			break;
            	default: 
            			break;
            }
            this.pending = null;
            this.tempResult = null; 
            
        }
	}
	clear(){
		this.pending = null;
		this.afterEqual = false; 
		this.internalProgram = [];
		this.accumulator = 0;
	}
	performOperation(symbol){
		
		if(this.internalProgram.length === 0){
			this.pushToProgram(this.accumulator);
		}
		switch(symbol){
			case "AC":
			case "C":
				this.clear();
				break;
			case "+": 	
			case "-":
			case "×":
			case "÷":
			case "xⁿ":
					this.executePendingBinaryOperation();
                    this.pending = new Pending( (this.accumulator),(symbol));
                    this.afterEqual = false;
                    this.pushToProgram(symbol);
                    //keep track of if the last thing the user did was enter a number or symbol
					this.enteredDigit = false;
					break;
			case "√":
			case "x²":
			case "∓":
			case "x⁻¹":
				 	this.executeUnaryOperation(symbol);	
				 	this.pushToProgram(symbol);

				 	break; 
			case "=":				
					this.executePendingBinaryOperation();
					this.afterEqual = true;

					break;
			default: console.log("other"); //print other if a symbol is not recognized
		}
	
	}
	//check to see wheter a calculation is complete
	//considered complete if there is no pending calculations left or the last
	//button pressed was equal
	//this means all unary calculations that are done outside of a pending calculation
	//are considered complete
	//if the calculation is complete, clear the internal program so it is ready for the
	//next calculation
	isCompleteCalculation(){
		var isComplete = this.afterEqual || !this.pending;  
		if(isComplete){
			this.internalProgram = [];
		}
		return isComplete;
	}
	//read a string calculation and redo all the calculations
	redoCalc(calculation){
		var calcBrain = this; 
		var inputNumber = ""; 
		var calculationStrArray = calculation.split(" ");
		calculationStrArray.forEach(function(str){	
			if(!isNaN(str)){
				inputNumber += str;			
			}else{				
				if(inputNumber !== ""){
					calcBrain.setOperand(inputNumber);
					inputNumber = "";
				}
				calcBrain.performOperation(str);
			}
		});
		if(inputNumber !== ""){
			calcBrain.accumulator = inputNumber;
			
		}
		this.executePendingBinaryOperation();
		this.internalProgram = []; //wipe out the internal program that was being made during calculation
		this.afterEqual = true; 

	}
}