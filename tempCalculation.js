class temporaryCalculation{
	constructor(){
		var _tempResult = null;
		this._internalProgram = []; 
	
	}
	set tempResult(tempResult){
		this._tempResult = tempResult; 
	}
	get tempResult(){
		return this._tempResult; 
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
}