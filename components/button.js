export function createButton({ text, className = "", onClick }) {
    const button = document.createElement("button");
    button.className = className;
    button.innerHTML = text;
    button.addEventListener("click", onClick);
    return button;
}