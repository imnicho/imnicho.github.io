document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("terminalInput");
    const outputDiv = document.querySelector(".output");
    let postList = []; // Stores post filenames and metadata

    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            let command = inputField.value.trim().toLowerCase();
            inputField.value = "";
            processCommand(command);
        }
    });

    function processCommand(command) {
        let args = command.split(/\s+/);
        let primaryCommand = args[0];
        let argument = args[1] || null;

        switch (primaryCommand) {
            case "help":
                appendToTerminal("Available commands:");
                appendToTerminal("- list → View available blog posts with metadata");
                appendToTerminal("- open [filename] → Open a blog post (e.g., 'open hello-world')");
                appendToTerminal("- open [number] → Open a blog post by number (e.g., 'open 3')");
                appendToTerminal("- home → Return to homepage");
                appendToTerminal("- back → Go to the previous page");
                break;

            case "list":
                fetchPostMetadata();
                break;

            case "home":
                window.location.href = "/index.html";
                return;

            case "back":
                window.history.back();
                return;

            case "open":
                if (!argument) {
                    suggestPosts();
                    return;
                }

                if (!isNaN(argument)) {
                    let index = parseInt(argument, 10) - 1;
                    if (index >= 0 && index < postList.length) {
                        let filename = postList[index].filename;
                        openPost(filename);
                    } else {
                        appendToTerminal("Invalid post number. Type 'list' to see available posts.");
                    }
                } else {
                    openPost(argument);
                }
                break;

            default:
                appendToTerminal(`Unknown command: '${command}'. Type 'help' for a list of commands.`);
        }
    }

    function fetchPostMetadata() {
        fetch("/blog/posts/")
            .then(response => response.text())
            .then(text => {
                let files = text.match(/href="(.*?)"/g) || [];
                postList = files
                    .map(link => link.replace(/href="|"/g, ''))
                    .filter(filename => filename.endsWith(".md"))
                    .map(filename => filename.split('/').pop().replace(".md", "")) // Remove directory paths and extensions
                    .map(filename => ({
                        filename,
                        size: getRandomFileSize(),
                        date: getRandomDate()
                    }));

                if (postList.length === 0) {
                    appendToTerminal("No blog posts found.");
                } else {
                    appendToTerminal("Available blog posts:");
                    appendToTerminal("--------------------------------------------------");
                    appendToTerminal("#   | Filename          | Size   | Date");
                    appendToTerminal("--------------------------------------------------");
                    postList.forEach((post, index) => {
                        appendToTerminal(`${(index + 1).toString().padEnd(3)} | ${post.filename.padEnd(15)} | ${post.size.padEnd(6)} | ${post.date}`);
                    });
                    appendToTerminal("--------------------------------------------------");
                    appendToTerminal("Use 'open [filename]' or 'open [number]' to open a post.");
                }
            })
            .catch(() => appendToTerminal("Error fetching post list."));
    }

    function openPost(filename) {
        fetch(`/blog/posts/${filename}.md`)
            .then(response => {
                if (!response.ok) throw new Error("Post not found.");
                return response.text();
            })
            .then(text => displayPost(filename, text))
            .catch(() => appendToTerminal(`Post '${filename}' not found. Type 'list' to see available posts.`));
    }

    function suggestPosts() {
        appendToTerminal("Usage: open [filename] or open [number]");
        appendToTerminal("Example: open hello-world or open 3");
        appendToTerminal("Type 'list' to see available blog posts.");
    }

    function displayPost(filename, content) {
        appendToTerminal(`\n===== ${filename} =====\n`);
        renderMarkdown(content);
    }

    function renderMarkdown(markdown) {
        let parsedText = markdown
            .replace(/^# (.*?)$/gm, "\n$1\n" + "-".repeat(40))  
            .replace(/^## (.*?)$/gm, "\n$1\n" + "-".repeat(30))  
            .replace(/\*\*(.*?)\*\*/gm, "[$1]")                  
            .replace(/\*(.*?)\*/gm, "_$1_")                      
            .replace(/`(.*?)`/gm, "`$1`")                        
            .replace(/\[(.*?)\]\((.*?)\)/gm, "$1 ($2)")          
            .replace(/\n{2,}/g, "\n\n");                         

        typeOutText(parsedText);
    }

    function typeOutText(text) {
        let index = 0;

        function typeCharacter() {
            if (index < text.length) {
                let char = text[index];
                appendToTerminal(char, true);
                index++;
                setTimeout(typeCharacter, 10);
            }
        }

        typeCharacter();
    }

    function appendToTerminal(text, noNewLine = false) {
        const lastLine = outputDiv.lastElementChild;

        if (noNewLine && lastLine) {
            lastLine.innerHTML += text;
        } else {
            const newLine = document.createElement("p");
            newLine.textContent = text;
            outputDiv.appendChild(newLine);
        }

        outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    function getRandomFileSize() {
        return (Math.random() * (50 - 5) + 5).toFixed(2) + "KB";
    }

    function getRandomDate() {
        const start = new Date(2023, 0, 1);
        const end = new Date();
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return date.toISOString().split("T")[0];
    }
});