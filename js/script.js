
// var worker = new SharedWorker("js/worker.js");
      
//   worker.port.addEventListener("message", function(e) {
//     console.log(e.data);
//   }, false);

// worker.port.start();
// worker.port.postMessage("Вася");


let images = document.querySelectorAll('[data-src]'),
    sections = document.querySelectorAll('section'),
    pb = document.querySelector('aside .progress');

window.onload = function () {

	var document = window.document;
	var pageProgressNode = document.querySelector('.progress');

	function percentScroll(){
		var f = document.body.scrollHeight - window.innerHeight;
		var s = (document.documentElement.scrollTop ? document.documentElement : document.body).scrollTop;
		var d=s/f*100; 
		var p=Math.round(d);
		return p;
	}

	window.addEventListener('scroll', function() {
		var p = percentScroll();
		var h = 'calc('+p+'% - 128px)';
		pageProgressNode.style.height = p+'%';
	});

	lazyLoad(images);

	if (('IntersectionObserver' in window)) {

		let config = { threshold: [.0,.1,.2,.3,.4,.5,.6,.7,.8,.9,1] };
			sectionObserver = new IntersectionObserver(onIntersectionSection, config);

	}

    sections.forEach(section => {
        
        if (('IntersectionObserver' in window)) {
        	sectionObserver.observe(section);
        }

        let title = section.getAttribute('data-title'),
            section_id = section.getAttribute('id'),
            id = 'pb-'+section_id,
            pb_item = document.createElement('div');

        pb_item.setAttribute('id',id);
        pb_item.setAttribute('role','button');
        pb_item.classList.add('pb-item');

        pb_item.addEventListener('click', function(){
			let V = 0.0001,
				target_id = this.getAttribute('id').replace('pb-',''),
				target_id_top = document.getElementById(target_id).getBoundingClientRect().top,
				w_scroll = window.pageYOffset,
				target_top = w_scroll + target_id_top,
				start = null;

				var pb_items = document.querySelectorAll('.pb-item');
                  pb_items.forEach(item => {
                      item.classList.remove('active');
                  });

				this.classList.add('active');

				var all_sections = document.querySelectorAll('section');
				  all_sections.forEach(item => {
				      item.classList.remove('active');
				      item.classList.remove('visible');
				  });
				  

				var target_section = document.getElementById(target_id);
					target_section.classList.add('active');
					target_section.classList.add('visible');

            	let h1 = target_section.getElementsByTagName('h1')[0];
    			let title = h1.innerHTML.replace('<span>',' ');
    		
    			document.title = title.replace('</span>','');

	        requestAnimationFrame(step);
	        function step(time) {
	            if (start === null) start = time;
	            var progress = time - start,
	                r = (target_id_top < 0 ? Math.max(w_scroll - progress/V, target_top) : Math.min(w_scroll + progress/V, target_top));
	            window.scrollTo(0,r);
	            if (r != target_top) {
	                requestAnimationFrame(step)
	            }
	        }

        });

        let pb_item_p = document.createElement('p');
        	pb_item_p.innerText = title;

        pb_item.appendChild(pb_item_p);

        pb.appendChild(pb_item);

    });  

  }

function onIntersectionSection (entries, self) {
  entries.forEach(entry => {

	// console.dir(entry.intersectionRatio);

    let target_id = 'pb-'+entry.target.getAttribute('id');
    let	target_el = document.getElementById(target_id);
    let title = '';

    if (entry.intersectionRatio > 0.5) {
        entry.target.classList.add('visible');
    	
    	let h1 = entry.target.getElementsByTagName('h1')[0];
    	let title = h1.innerHTML.replace('<span>',' ');
    	document.title = title.replace('</span>','');

        target_el.classList.add('active');
    } else {
        entry.target.classList.remove('visible'); 
        target_el.classList.remove('active');    
    }


  });
}



function lazyLoad (images) {
    images.forEach(img => {
      var n_src = img.getAttribute('data-src').replace('.jpg','.png');
      img.setAttribute('src',n_src);
    }); 
}




document.onkeydown = function(e) {
  e = e || window.event;
  if (e.keyCode == 27 && tooltip ) {
  	close_modal();
  }

  if (e.keyCode == 39 && tooltip) {
  		document.querySelectorAll('.opts.modal button.next')[0].click();
  } 
  if (e.keyCode == 37 && tooltip) {
  		document.querySelectorAll('.opts.modal button.prev')[0].click();
  }

  return;
}





let toggler = document.querySelectorAll('[data-toggler]');
toggler.forEach((el) => {
  el.addEventListener('click', function(){
  
    let targetSelectorString = this.getAttribute('data-toggler');
    let targetSelector = targetSelectorString.replace('id-','#').replace('class-','.');
    
    let target = document.querySelectorAll(targetSelector);
        target[0].classList.toggle('active');

    this.innerHTML = this.innerHTML != 'menu' ? 'menu' : 'close';
  
  });
});


var tooltip = false;
let opts = document.querySelectorAll('.opts');
for (var i=0; i<=opts.length-1; i++) {

	opts[i].index = i;
	opts[i].addEventListener('click', function(){
		
		close_modal();
		tooltip = true;

		let coords = this.getBoundingClientRect();

		let temp = this.cloneNode(true);
			temp.classList.remove('col');
			temp.className += ' active modal flex';
		
		let close_button = document.createElement('button');
			close_button.className = 'opts-info close';
			close_button.innerHTML = 'esc';
			close_button.addEventListener('click', close_modal);

		temp.insertBefore(close_button,temp.firstChild);

		let navigation_footer = document.createElement('div');
 			navigation_footer.className = 'flex opts-info';

		let next_item = opts[this.index+1];

		let span_count = document.createElement('span');
			span_count.className = 'count';
			span_count.innerHTML = this.index+1+' of '+opts.length;

		var next_button = document.createElement('button');
			next_button.className = 'opts-info next';

		if (next_item) {
			var next_item_header = next_item.querySelectorAll('h2 span')[0].innerHTML+'  &#8594';
				next_button.innerHTML = next_item_header;
			next_button.addEventListener( 'click', function () {
				temp.remove();
				next_item.click();
			});
		} else {
			next_button.style.opacity = 0;
		}

		var prev_item = opts[this.index-1],
			prev_button = document.createElement('button');
			prev_button.className = 'opts-info prev';
		if (prev_item) {
			var prev_item_header = '&#8592  '+prev_item.querySelectorAll('h2 span')[0].innerHTML;
				prev_button.innerHTML = prev_item_header;
			prev_button.addEventListener( 'click', function () {
				temp.remove();
				prev_item.click();
			});
		} else {
			prev_button.style.opacity = 0;
		}

		navigation_footer.appendChild(next_button);
		navigation_footer.insertBefore(prev_button,next_button);
		navigation_footer.insertBefore(span_count,next_button);
		
		temp.appendChild(navigation_footer);
		
		// temp.addEventListener('mouseout',function(){
		// 	this.style.top = '70%';
		// });
		// temp.addEventListener('mouseover',function(){
		// 	this.style.top = '32px';
		// });

		document.body.appendChild(temp);

	});
}

	
var close_modal = function () {
	let modal = document.querySelector('.modal');

	if (modal) {
		tooltip = false;
		modal.classList.add('close');
		setTimeout( () => {
			modal.remove();
		},1000);
	}
}









