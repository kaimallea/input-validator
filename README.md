# Input Validator

## Usage

Simply include the JS file in your document's `<head>` or at the bottom of your document's `<body>`.

### Example

    <!DOCTYPE html>
    <html lang="en">
      <body>
        <input type="text" name="email" value="" id="email">
        
        <br />
        
        <input type="text" name="cc" value="" id="cc">
        
        <script src="input-validator.js"></script>
        
        <script>
          var input_email = document.getElementById("email"),
              input_cc = document.getElementById("cc");
      
          // Accepts input element objects directly and adds
          // simple, visual indications
          IV.email(input_email);
          IV.credit(input_cc);
      
          // ... Also accepts strings
          alert( IV.email("someone@gmail.com") );
        </script>
      </body>
    </html>

## Release History

> 0.1 - Initial, experimental commit.