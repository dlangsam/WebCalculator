$(document).on('ready', function(){
	var userInMiddleOfTyping = false; 
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
        //print("Change typing to true")
        userInMiddleOfTyping = true;

	});



}); 