// Vulnerable JavaScript Example

// 1. Cross-Site Scripting (XSS)
function displayUserInput() {
    var userInput = document.getElementById('userInput').value;
    // Directly inserting user input into the DOM without sanitization
    // Insert text safely to avoid executing HTML/script
    document.getElementById('output').textContent = userInput;
}

// 2. Insecure use of eval
function executeUserScript() {
    var userScript = document.getElementById('userScript').value;
    // Do not execute user-provided code. If limited scripting is required, implement a safe interpreter or whitelist.
    console.warn('executeUserScript was called but execution of user-provided scripts is disabled for security reasons.');
    // Optionally, evaluate in a sandboxed environment or parse/whitelist commands instead of using eval.
}

// 3. Unsecured AJAX request
function loadUserData() {
    var xhr = new XMLHttpRequest();
    // Use HTTPS and ensure the endpoint allows CORS if called from a browser context
    xhr.open('GET', 'https://example.com/userdata', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('ajaxOutput').innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}
