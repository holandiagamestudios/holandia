

function upgrade(){
	var ele = document.getElementById('Scr');
	var per = document.getElementById('Per');
  var upg = document.getElementById('Upg');
  if(parseInt(ele.innerHTML)>=parseInt(upg.innerHTML)){
    upg.innerHTML = parseInt(upg.innerHTML)*3;
    per.innerHTML = parseInt(per.innerHTML)+1;
  }
}

function km(){
	var ele = document.getElementById('Scr');
	var per = document.getElementById('Per');
  var upg = document.getElementById('Upg');
	
	ele.innerHTML = parseInt(ele.innerHTML)+parseInt(per.innerHTML);
  document.cookie="";
	api.set('score',ele.innerHTML);
  api.set('per',per.innerHTML);
  api.set('upg',upg.innerHTML);
	level();
}

function level(){
	var scr = parseInt(document.getElementById('Scr').innerHTML);
	var lvl = document.getElementById('Lvl');
	
	if(scr<=100){
		lvl.inner.HTML = "Mickiewicz przez V";	
	}
	else if(scr<=1000){
		lvl.innerHTML =	"oliWier";
	}
	else if(scr<=10000){
		lvl.innerHTML = "oliVier";	
	}
	else if(scr<=100000){
		lvl.innerHTML = "Bańki";
	}
	else if(scr<=1000000){
		lvl.innerHTML = "Latający holender";	
	}
	else{
		lvl.innerHTML = "Average holaVdia fan";
	}
	console.log("kmp");
}

function loadcookie(){
	if(document.cookie!==""){
	  	var ele = document.getElementById('Scr');
	  	var per = document.getElementById('Per');
    		var upg = document.getElementById('Upg');
		ele.innerHTML=api.get('score');
    		per.innerHTML=api.get('per');
    		upg.innerHTML=api.get('upg');
		level();
	}
}

function resetscr() {
  var ele = document.getElementById('Scr');
	var per = document.getElementById('Per');
  var upg = document.getElementById('Upg');
	ele.innerHTML="0";
	per.innerHTML="1";
  upg.innerHTML="100";
	document.cookie="";
	api.set('score',ele.innerHTML);
  api.set('per',per.innerHTML);
  api.set('upg',upg.innerHTML);

}


///////////////
// js-cookie //
///////////////

function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function CookieSet (key, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      key + '=' + converter.write(value, key) + stringifiedAttributes)
  }

  function CookieGet (key) {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var foundKey = decodeURIComponent(parts[0]);
        jar[foundKey] = converter.read(value, foundKey);

        if (key === foundKey) {
          break
        }
      } catch (e) {}
    }

    return key ? jar[key] : jar
  }

  return Object.create(
    {
      set: CookieSet,
      get: CookieGet,
      remove: function (key, attributes) {
        set(
          key,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });
