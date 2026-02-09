const searchForm = document.getElementById("search-form");
const searchFormInput = document.getElementById("search-form-input");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = searchFormInput.value;
    window.location.href = `events.html?search=${value}#upcoming_events`;
});