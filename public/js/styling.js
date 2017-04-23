(function(){
	//dynamic on click functionality for card
	document.addEventListener('click',(e) => {
		console.log(e);
		if(e.target && e.target.parentNode.classList.contains('cardInner') && e.target.parentNode.classList.contains('flipped')){
			e.target.parentNode.classList.remove('flipped');
		} else if (e.target && e.target.parentNode.classList.contains('cardInner')){
			e.target.parentNode.classList.add('flipped');
		}
	});
	/*
	const cardSelected = document.getElementsByClassName('card');
	for(let x = 0;x<cardSelected.length;++x){
		//add click event to all cards
		cardSelected[x].addEventListener('click', (e) => {
			console.log('clicked');
			if(this.querySelector('.cardInner').classList.contains('flipped')){
				this.querySelector('.cardInner').classList.remove('flipped');
			}else{
				this.querySelector('.cardInner').classList.add('flipped');
			}
		});
	}
	*/
}())
