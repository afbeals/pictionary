(function(){
	//on click functionality
	document.body.addEventListener('click',(e) => {
		console.log(e);
		//flip functionality for card 
		if(e.target && e.target.parentNode.classList.contains('cardInner') && e.target.parentNode.classList.contains('flipped')){
			e.target.parentNode.classList.remove('flipped');
		} else if (e.target && e.target.parentNode.classList.contains('cardInner') && e.target.parentNode.classList.contains('active')){
			e.target.parentNode.classList.add('flipped');
		}
		//functionality for card buttons
		if(e.target && e.target.classList.contains('Final') || e.target.classList.contains('fa-check')){
			e.target.closest('.cardInner').classList.add('selected');
			setTimeout(()=>{
				let cardSelected = document.querySelectorAll('.cardInner');
				for(let x = 0;x<cardSelected.length;++x){
					//add click event to all cards
					if(!cardSelected[x].classList.contains('selected')){
						cardSelected[x].classList.add('dis');
						cardSelected[x].classList.remove('active');
						(cardSelected[x].classList.contains('flipped')) ? cardSelected[x].classList.remove('flipped') : null
					}
				};
				e.target.closest('.cardInner').classList.remove('flipped')}
				,250);
		} else if (e.target && e.target.classList.contains('Possible') || e.target.classList.contains('fa-exclamation')){
			e.target.closest('.cardInner').classList.add('caution');
			setTimeout(()=>{e.target.closest('.cardInner').classList.remove('flipped')},500);
		} else if (e.target && e.target.classList.contains('notPossible') || e.target.classList.contains('fa-times')){
			e.target.closest('.cardInner').classList.add('dis');
			setTimeout(()=>{e.target.closest('.cardInner').classList.remove('flipped')},500);
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
