jQuery.fn.liveSearch = function(options)
{	
	var settings = $.extend({
		caseInsensitive	: true,
		cache			: true,
		highlight		: true,
		highlightClass	: 'highlightText',
		selector		: false
        }, options );
	
	if(!settings.selector)
	{
		console.log('liveSearch has no selector');
		return;	
	}
	
	if(settings.cache)
	{
		cacheData = ((settings.caseInsensitive) ? $(settings.selector).map(function(){return $(this).text().toLowerCase()}) : $(settings.selector).map(function(){return $(this).text()}));	
	}
	
	this.keyup(filter).keyup();
	
	return this;
		
	function filter()
	{
		var term = $.trim( ((settings.caseInsensitive) ? $(this).val().toLowerCase() : $(this).val()) ), scores = [];
		
		if(settings.highlight)
		{
			$('.' + settings.highlightClass).each(function() {
				var parent = $(this).parent();
				$(this).contents().unwrap();
				$(parent).html($(parent).html());
            });
		}

		if ( !term )
		{
			$(settings.selector).show();
		}
		else
		{
			$(settings.selector).hide();
			if(settings.cache)
			{
				cacheData.each(function(i){
					if (cacheData[i].indexOf(term) > 0) { scores.push(i); }
				});   
			}
			else
			{
				$(settings.selector).each(function(i){
					if ($(this).innerHTML.indexOf(term).lenght > 0) { scores.push(i); }
				});   				
			}
			
			var regex = new RegExp(term, "gi");
			$.each(scores.sort(function(a, b){return b[0] - a[0];}), function(){
				$($(settings.selector)[ this ]).show();
				
				if(settings.highlight)
				{
					$($(settings.selector)[ this ]).find('*').each(function () {
						$(this).contents().filter(function() {
							return this.nodeType == 3 && regex.test(this.nodeValue);
						}).replaceWith(function() {
							return (this.nodeValue || "").replace(regex, function(match) {
								return "<span class=\"" + settings.highlightClass + "\">" + match + "</span>";
							});
						});
					});
				}
			});
		}
	}
};