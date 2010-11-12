/**
 * Input Validator
 *
 * @author Kai Mallea (kmallea@gmail.com)
 * @version 0.1a
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
     * Regular expression to validate an e-mail address.
     *
     * @see http://www.regular-expressions.info/email.html
     */
    var _email_validator_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    
    
    /**
     * Credit card validator
     *
     * @see http://en.wikipedia.org/wiki/Luhn_algorithm
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
    
 
    /**
     * Check for an HTMLInputElement
     */
    function isInputElement (e) {
        return (e && typeof e === 'object' && e.toString() === '[object HTMLInputElement]');
    }


    /**
     * Check for a string
     */
    function isString (str) {
        return (typeof str === 'string');
    }


    /**
     * Check for a number
     */
    function isNumber (num) {
        return (typeof num === 'number');
    }


    /**
     * Check if a DOM element contains a specific class name.
     *
     * @param e  DOM element
     * @param classname  CSS class name
     *
     * @return an array (true) or an empty array (false)
     */
    function hasClass (e, classname) {
        return e.className.match(new RegExp('(\\s|^)' + classname + '(\\s|$)'));
    }


    /**
     * Add a class name to a DOM element if it doesn't already exist.
     *
     * @param e  DOM element
     * @param classname  CSS class name
     */    
    function addClass (e, classname) {
        if (!hasClass(e, classname)) { e.className += " " + classname };
    }
    
    
    /**
     * Remove a class name from a DOM element if it exists.
     *
     * @param e  DOM element
     * @param classname  CSS class name
     */  
    function removeClass (e, classname) {
	    if (hasClass(e, classname)) {
            var reg = new RegExp('(\\s|^)' + classname + '(\\s|$)');
		    e.className = e.className.replace(reg,' ');
	    }       
    }


    /**
     * Apply this application's default class name to a DOM element 
     * (iv-input-default).
     *
     * @param e  DOM element
     */
    function applyDefaultClass (e) {
        if (!hasClass(e, 'iv-input-default')) {
            addClass(e, 'iv-input-default');
        }
    }
    
    
    /**
     * Hide (destroy) a notification associated with an
     * HTMLInputElement.
     *
     * @param e  HTMLInputElement
     */    
    function hideNotification(e) {
        if (!isInputElement(e)) { return };
        var span = document.getElementById("iv-notify-" + e.id) || "";
        if (span) { span.parentNode.removeChild(span); }
    }
    

    /**
     * Display a notification adjacent to an HTMLInputElement.
     *
     * @param e  HTMLInputElement
     * @param msg  The message to display
     * @param loc  The location of the notification relative to the
     *            HTMLInputElement ('right', 'bottom').
     */   
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
    

    /**
     * Validate whether or not an e-mail address is properly formatted.
     * The addr argument must be a string or an HTMLInputElement. The
     * former will return a boolean, the latter will assign a function 
     * to the HTMLInputElement's onblur property/event.
     *
     * @param addr  a string or HTMLInputElement
     *
     * @return <code>true</code> if the e-mail address is valid or 
     *         <code>false</code> is the its invalid.
     *
     * @throws an error if a string or HTMLInputElement is not passed.
     */
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


    /**
     * Validates a credit card number using the Luhn algorithm.
     *
     * The num argument must be a number, string or an 
     * HTMLInputElement. A string or number will return a 
     * boolean, an HTMLInputElement will assign a function to
     * its onblur property/event.
     *
     * @param num  a string, number or HTMLInputElement
     *
     * @return <code>true</code> if the credit card is valid or 
     *         <code>false</code> is the its invalid.
     *
     * @throws an error if a string, number or HTMLInputElement is not 
     *         passed.
     */
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
    

    /**
     * Validates a password's complexity.
     *
     * The str argument must be a string. Returns true or false.
     *
     * @param str  a string
     *
     * @return <code>true</code> if the password is complex and
     *         <code>false</code> it is not.
     *
     * @throws an error if a string is not passed.
     */
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

    return {    // Publicly accessible methods in the IV namespace
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
