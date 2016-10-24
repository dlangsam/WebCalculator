//Class to keep track of the first operand and operation for binary operations

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