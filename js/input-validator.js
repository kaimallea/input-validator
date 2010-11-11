/**
 * Input Validator
 *
 * @author Kai Mallea (kmallea@gmail.com)
 *
 */
var IV = (function () {
    var _defaults = {
            
            // Locations for notifications
            notify_location: {
                
                // Below element e
                bottom: function (e) {
                    return {
                        x: e.offsetLeft,
                        y: (e.offsetTop + e.offsetHeight)
                    };                    
                },
                
                // To the right of element e
                right: function (e) {
                    return {
                        x: (e.offsetLeft + e.offsetWidth),
                        y: e.offsetTop
                    };
                }
            },
            
            // Default messages to display in notifications
            msgs: {
                email: "Invalid e-mail address",
                credit: "Invalid credit card number",
                password: "Password must be at least 8 characters and contain at least once uppercase letter"
            }
        };
    
    /**
     * E-mail validator
     */
    var _email_validator_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    
    
    /**
     * Credit card validator
     *
     * Luhn algorithm (http://en.wikipedia.org/wiki/Luhn_algorithm)
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


    /**
     * Password validator
     */
    var _password_validator = function (str) {
        // Minimum length
        if (str.length < 8) { return false }

        // At least one capital letter
        if (!(/[A-Z]/).test(str)) { return false }

        return true;
    }
    
   
    function isInputElement (e) {
        return (e && typeof e === 'object' && e.toString() === '[object HTMLInputElement]');
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


    function applyDefaultClass (e) {
        if (!hasClass(e, 'iv-input-default')) {
            addClass(e, 'iv-input-default');
        }
    }
    
    
    function hideNotification(e) {
        if (!isInputElement(e)) { return };
        var span = document.getElementById("iv-notify-" + e.id) || "";
        if (span) { span.parentNode.removeChild(span); }
    }
    
    
    function displayNotification (e, msg, loc) {
        if (!isInputElement(e)) { return; }
        
        var exists = document.getElementById("iv-notify-" + e.id) || "",
            span = exists ? exists : document.createElement("span");
        
        switch(loc) {
            case 'bottom':
                loc = _defaults.notify_location.bottom(e);
                break;
            case 'right':
                loc = _defaults.notify_location.right(e);
                break;
            default:
                loc = _defaults.notify_location.right(e);
                break;
        }
        
        span.style.left = loc.x + "px";
        span.style.top = loc.y + "px";
        span.innerHTML = msg;
                
        if (!exists) {
            span.id = "iv-notify-" + e.id;
            addClass(span, "iv-notification");
            document.body.appendChild(span)        
        }
    }
    
    
    function validate_email (addr) {
        if (isString(addr)) {
            return _email_validator_regex.test(addr);
        } else if (isInputElement(addr)) {
            applyDefaultClass(addr);
            addr.onblur = function () {
                var that = this;
                if (_email_validator_regex.test(that.value)) {
                    removeClass(that, "iv-input-fail");
                    hideNotification(that);
                    addClass(that, "iv-input-pass");
                } else {
                    removeClass(that, "iv-input-pass");
                    addClass(that, "iv-input-fail");
                    displayNotification(that, _defaults.msgs.email);
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
            applyDefaultClass(num);
            num.onblur = function () {
                var that = this;
                if (_credit_validator(that.value)) {
                    removeClass(that, "iv-input-fail");
                    hideNotification(that);
                    addClass(that, "iv-input-pass");
                } else {
                    removeClass(that, "iv-input-pass");
                    addClass(that, "iv-input-fail");
                    displayNotification(that, _defaults.msgs.credit);
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
            applyDefaultClass(str);
            str.onblur = function () {
                var that = this;
                if (_password_validator(that.value)) {
                    removeClass(that, "iv-input-fail");
                    hideNotification(that);
                    addClass(that, "iv-input-pass");
                } else {
                    removeClass(that, "iv-input-pass");
                    addClass(that, "iv-input-fail");
                    displayNotification(that, _defaults.msgs.password);
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
