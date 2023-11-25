const creatAutocomplete = ({
  root,
  optionRender,
  onOptionSelect,
  selectValue,
  fetchData
}) => {
  root.innerHTML = `
   <label for="input"><b>Search <br></label>
   <input id="input" class="input is-expanded"/>
   <div class="dropdown tutdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
   </div>
   `;

  const widget = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");
  const onInput = root.querySelector("#input");

  const deBounced = (func, delay = 1000) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const Input = async (event) => {
    const items = await fetchData(event.target.value);
    widget.classList.add("is-hidden");
    console.log(items);
    if (!items.length) {
      return;
    }

    resultsWrapper.innerHTML = "";

    widget.classList.remove("is-hidden");

    for (let item of items) {
      const option = document.createElement("a");
      option.classList.add("dropdown-item");
      option.innerHTML = optionRender(item);

      resultsWrapper.appendChild(option);

      option.addEventListener("click", () => {
        widget.classList.add("is-hidden");
        onInput.value = selectValue(item);
        onOptionSelect(item);
      });
    }
  };
  onInput.addEventListener("input", deBounced(Input, 500));
};
