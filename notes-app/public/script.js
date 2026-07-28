const btn = document.getElementById("btn");
const result = document.getElementById("result");

btn.addEventListener("click", async () => {

    const response = await fetch("/api");

    const data = await response.json();

    result.innerHTML = data.message;

});