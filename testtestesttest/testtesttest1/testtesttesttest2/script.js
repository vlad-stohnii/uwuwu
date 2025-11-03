// Vulnerable JavaScript Example

// 1. Cross-Site Scripting (XSS)
function displayUserInput() {
    var userInput = document.getElementById('userInput').value;
    // Directly inserting user input into the DOM without sanitization
    document.getElementById('output').textContent = userInput;
}

// 2. Insecure use of eval
function executeUserScript() {
    var userScript = document.getElementById('userScript').value;
    // Avoid using eval: parse user intent or sandbox execution
    try {
        // If users supply JSON with a function name and args, avoid eval by mapping allowed functions
        var parsed = JSON.parse(userScript);
        if (parsed && parsed.action && typeof parsed.action === 'string') {
            // Example whitelist of allowed actions
            var actions = {
                sayHello: function(name) { alert('Hello, ' + String(name)); },
                computeSum: function(a, b) { return Number(a) + Number(b); }
            };
            if (actions.hasOwnProperty(parsed.action)) {
                var args = Array.isArray(parsed.args) ? parsed.args : [];
                actions[parsed.action].apply(null, args);
            } else {
                console.warn('Unrecognized action:', parsed.action);
            }
        } else {
            console.warn('User script did not match expected JSON action format.');
        }
    } catch (e) {
        console.warn('Failed to parse user script as JSON, execution skipped.', e);
    }
}

// 3. Unsecured AJAX request
function loadUserData() {
    var xhr = new XMLHttpRequest();
    // Using HTTP instead of HTTPS and no proper handling of CORS
    // Use HTTPS for secure transport and consider CORS settings on the server side
    xhr.open('GET', 'https://example.com/userdata', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('ajaxOutput').innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}
