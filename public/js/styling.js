(function(){
	//on click functionality
	document.body.addEventListener('click',(e) => {
		//flip functionality for card 
		let t = e.target,pN = t.parentNode,cL = pN.classList;
		if(t && cL.contains('cardInner') && cL.contains('flipped')){
			cL.remove('flipped');
		} else if (t && cL.contains('cardInner') && cL.contains('active') && !(cL.contains('selected'))){
			cL.add('flipped');
		}
		//functionality for card buttons
		if(t && e.target.classList.contains('Final') || e.target.classList.contains('fa-check')){
			t.closest('.cardInner').classList.add('selected');
			setTimeout(()=>{
				let cardSelected = document.querySelectorAll('.cardInner');
				for(let x = 0;x<cardSelected.length;++x){
					//add click event to all cards
					if(!cardSelected[x].classList.contains('selected')){
						cardSelected[x].classList.add('dis');
						cardSelected[x].classList.remove('active','caution');
						(cardSelected[x].classList.contains('flipped')) ? cardSelected[x].classList.remove('flipped') : null
					}
				};
				t.closest('.cardInner').classList.remove('flipped')}
				,250);
			PIC.player.guess = pN.parentNode.parentNode.firstElementChild.innerText;
		} else if (t && t.classList.contains('Possible') || t.classList.contains('fa-exclamation')){
			t.closest('.cardInner').classList.add('caution');
			setTimeout(()=>{t.closest('.cardInner').classList.remove('flipped')},500);
		} else if (t && t.classList.contains('notPossible') || t.classList.contains('fa-times')){
			t.closest('.cardInner').classList.add('dis');
			setTimeout(()=>{t.closest('.cardInner').classList.remove('flipped')},500);
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
