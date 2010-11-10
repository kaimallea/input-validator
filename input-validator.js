/**
 * Input Validator
 *
 * @author Kai Mallea (kmallea@gmail.com)
 *
 */
var IV = (function () {
    var _tracked_elements = [];
    
    /**
     * E-mail validator
     */
    var _email_validator_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    
    
    /**
     * Credit card validator
     *
     * Credit: Wikipedia
     */
    var _credit_validator = function (num) {
        num = (num + '').replace(/\D+/g, '').split('').reverse();
        if (!num.length) { return false };
        var total = 0, i;
        for (i = 0; i < num.length; i++) {
            num[i] = parseInt(num[i])
            total += i % 2 ? 2 * num[i] - (num[i] > 4 ? 9 : 0) : num[i];
        }
        return (total % 10) == 0;
    };


    var _password_validator = function (str) {
        // Minimum length
        if (str.length < 8) { return false }

        // At least one capital letter
        if (!(/[A-Z]/).test(str)) { return false }

        return true;
    }
    
   
    function isInputElement (e) {
        return (typeof e === 'object' && e.toString() === '[object HTMLInputElement]');
    }


    function isString (str) {
        return (typeof str === 'string');
    }


    function isNumber (num) {
        return (typeof num === 'number');
    }


    function hasClass (e, classname) {
	    return e.className.match(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
    }
    
    
    function addClass (e, classname) {
        if (!hasClass(e, classname)) { e.className += " " + classname };
    }
    
    
    function removeClass (e, classname) {
	    if (hasClass(e, classname)) {
            var reg = new RegExp('(\\s|^)' + classname + '(\\s|$)');
		    e.className = e.className.replace(reg,' ');
	    }       
    }


    function displayNotification (e, msg) {
        if (!e || typeof e !== 'object') { return; }
      
        var position = { x: e.offsetLeft, y: e.offsetTop },
            span = document.createElement("p");
       
        span.style.left = (position.x + e.offsetWidth) + "px";
        span.style.top = position.y + "px";
        span.className += "iv-notification";
        span.innerHTML = msg;
        
        document.body.appendChild(span);
    }
    
    
    function validate_email (addr) {
        if (isString(addr)) {
            return _email_validator_regex.test(addr);
        } else if (isInputElement(addr)) { 
            addr.onblur = function () {
                var that = this;
                if (_email_validator_regex.test(that.value)) {
                    removeClass(that, "iv-input-fail");
                    addClass(that, "iv-input-pass");
                } else {
                    removeClass(that, "iv-input-pass");
                    addClass(that, "iv-input-fail");
                    //displayNotification(that, "Invalid e-mail address");
                }
            }
        } else {
            throw new Error("Expected string or HTMLInputElement. Received " + typeof addr + ".");
        }
    }


    function validate_credit_card (num) {
        if (isString(num) || isNumber(num)) {
            return _credit_validator(num);
        } else if (isInputElement(num)) { 
            num.onblur = function () {
                var that = this;
                if (_credit_validator(that.value)) {
                    removeClass(that, "iv-input-fail");
                    addClass(that, "iv-input-pass");
                } else {
                    removeClass(that, "iv-input-pass");
                    addClass(that, "iv-input-fail");
                    //displayNotification(that, "Invalid credit card");
                }
            }
        } else {
            throw new Error("Expected string or HTMLInputElement. Received " + typeof num + ".");
        }
    }
    
    
    function validate_password (str) {
        if (isString(str)) {
            return _password_validator(str);
        } else if (isInputElement(str)) { 
            str.onblur = function () {
                var that = this;
                if (_password_validator(that.value)) {
                    removeClass(that, "iv-input-fail");
                    addClass(that, "iv-input-pass");
                } else {
                    removeClass(that, "iv-input-pass");
                    addClass(that, "iv-input-fail");
                    //displayNotification(that, "Invalid password.");
                }
            }
        } else {
            throw new Error("Expected string. Received " + typeof str + ".");
        }
    }

    return {
        email: function (addr) {
            return validate_email(addr);
        },
        
        credit: function (num) {
            return validate_credit_card(num);
        },
        
        password: function (str) {
            return validate_password(str);
        }
    };
})();
