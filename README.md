# Input Validator

## TODO

Tons. :)

## Usage

1. Create a link to the CSS stylesheet in your document's `<head>`
2. Include the Javascript file in your document's `<head>` or at the bottom of your document's `<body>` (right before the `</body>` closing tag -- recommended).

To enable validation on any input field, such as e-mail, use `IV.email(document.getElementById("input-email"));`. 

Or, to automatically create bindings based on an input element's `name` or `id` attribute, call `IV.automap()`.

Methods are polymorphic, so you can pass in an input element object like above, or a primitive value for a quick check. E.g., `alert( IV.email("kai@mallea.net") === true );`

Visual indications for input validity can be further customized by editing the stylesheet.

### Example

    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <link rel="stylesheet" ref="css/input-validator.css">
        <script src="input-validator.js"></script>
        <script>
            window.onload = function () {
                // When the page loads, automatically find all
                // relevant elements and create bindings
                IV.automap();
            }
      </head>
      <body>
        <input type="text" name="email" value="" id="email"><br />
        <input type="text" name="credit-card" value="" id="credit-card">
        
        <script>
        // Or you can create arbitrary bindings yourself:
          var input_email = document.getElementById("email"),
              input_cc = document.getElementById("cc");
      
          // Accepts input element objects directly and adds
          // simple, visual indications
          IV.email(input_email);
          IV.credit(input_cc);
          
          // You can also specify your own error message in the notification
          IV.email(input_email, "No. Try again.")
      
          // Accepts strings for quick tests
          alert( IV.email("someone@gmail.com") );
        </script>
      </body>
    </html>

## Release History

> 0.1a - Initial, experimental commit.