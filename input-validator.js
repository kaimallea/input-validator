/**
 * Input Validator
 *
 * @author Kai Mallea (kmallea@gmail.com)
 *
 */
var IV = (function () {
        /**
         * E-mail validator
         */
    var _email_validator_regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    
        /**
         * Credit card validator
         *
         * TODO: Granularity into specific CC types?
         */
        _credit_validator = function (num) {
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
     * Input type validator
     */
    function isInputElement (e) {
        return (typeof e === 'object' && e.toString() === '[object HTMLInputElement]');
    }

    /**
     * String type validator
     *
     * TODO: Check both strings and numbers
     */
    function isString (str) {
        return (typeof str === 'string');
    }
    
    /**
     * Perform glow effects on input elements
     */
    function glowElement (e, color) {
        // TODO: Pulsate
        color = (color) ? color : "#ff3300";
        e.style.border = "solid 3px " + color;
    }
    
    return {
        email: function (e, opt) {
            if (isString(e)) {
                return _email_validator_regex.test(e)
            } else if (isInputElement(e)) { 
                e.onblur = function () {
                    var that = this;
                    if (_email_validator_regex.test(that.value)) {
                        glowElement(that, "#00cc00");
                    } else {
                        glowElement(that);
                    }
                }
            } else {
                return;
            }    
        },
        
        credit: function (e, opt) {
            if (isString(e)) {
                return _credit_validator(e)
            } else if (isInputElement(e)) { 
                e.onblur = function () {
                    var that = this;
                    if (_credit_validator(that.value)) {
                        glowElement(that, "#00cc00");
                    } else {
                        glowElement(that);
                    }
                }
            } else {
                return;
            }
        }
    };
})();