# Input Validator

## TODO

Tons. :)

## Usage

Simply link to the CSS file in your document's `<head>` and include the JS file in your document's `<head>` or at the bottom of your document's `<body>`.

Then enable validation on any input field, such as e-mail, by calling `IV.email(document.getElementById("input-email"));`. 

Methods are polymorphic, so you can pass in an input element object like above, or a primitive value for a quick check. E.g., `alert( IV.email("kai@mallea.net") === true );`

Visual indications for input validity are automatic and can be customized by editing the stylesheet.

### Example

    <!DOCTYPE html>
    <html lang="en">
      <head>
        <link rel="stylesheet" ref="css/input-validator.css" charset="utf-8" />
      </head>
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

> 0.1a - Initial, experimental commit.