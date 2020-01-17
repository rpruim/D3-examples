## Basic interaction with drop down menus

The example demonstrates how to use drop down menus to allow users to interact with your D3 visualizations.

Steps:

1. Add `<select>` elements for each drop down. This could be done in HTML (as it is here) or in D3.

2. Populate the menu items (`<option>`). If these are computed from your data (as they are here), you will want to do this in D3.

3. Use `.on("change", change_function)` to call `change_function()` each time the seletion is changed. `change_function()` should be a function with no inputs. Make sure this is applied to the D3 selection for the `<select>` element and not for the `<option>` elements.

Additional notes for this example.

4. This uses `.join(enter => {}, update => {}, exit => {})` to add, modify, and remove elements in the DOM as selections change.
