$(document).ready(function() {

    $('.done').change(function() {
    	
        var $this = $(this);
        var coursesLength = $(document).find($('.done')).length;

    	if ($this.prop('checked')) {
        	
            $this.closest('.courses__item').addClass('courses__block-done').removeClass('courses__block-check');

            setTimeout(function(){

                if (!$this.closest('.courses__item').hasClass('courses__block-check')) {

                    $this.closest('.courses__item').css({
                        opacity: '0',
                    });
                    $this.closest('.courses__link').css({
                        cursor: 'default',
                    });
                }

            }, 1000);

    	} else {

        	$this.closest('.courses__item').removeClass('courses__block-done').addClass('courses__block-check');

   		}

        var coursesDoneLength = $(document).find($('.courses__block-done')).length;

        if (coursesLength === coursesDoneLength){
            
            setTimeout(function(){

                if (!$(document).find('.courses__block-check').length) {

                    $('.courses__done').fadeIn(500);
                }

            },1100);
        }
	});
});