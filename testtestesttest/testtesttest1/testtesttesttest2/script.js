// Vulnerable JavaScript Example

// 1. Cross-Site Scripting (XSS)
function displayUserInput() {
    var userInput = document.getElementById('userInput').value;
    // Directly inserting user input into the DOM without sanitization
    // Safely set textContent to avoid interpreting HTML and prevent XSS
    document.getElementById('output').textContent = userInput;
}

// 2. Insecure use of eval
function executeUserScript() {
    var userScript = document.getElementById('userScript').value;
    // Avoid eval: do not execute arbitrary user-provided code. If specific actions are needed, implement a safe command handler.
    console.warn('executeUserScript() called, but executing arbitrary scripts is disabled for security.');
}

// 3. Unsecured AJAX request
function loadUserData() {
    var xhr = new XMLHttpRequest();
    // Using HTTP instead of HTTPS and no proper handling of CORS
    xhr.open('GET', 'http://example.com/userdata', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('ajaxOutput').innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}
