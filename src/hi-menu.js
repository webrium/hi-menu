export default class ContextMenu {
  constructor(elementID, contextmenu_callback = null) {
    this.createMenuElements();
    this.elements = elementID
      ? document.querySelectorAll(elementID)
      : [document];
    this.contextmenu_callback = contextmenu_callback;

    this.attachEventListeners(elementID);
  }

  createMenuElements() {
    this.menu = this.createElement("div", {
      id: "custom-menu",
      class:
        "hi-select-none hi-bg-white dark:hi-bg-slate-800 dark:hi-text-white hi-absolute hi-flex hi-flex-col hi-gap-2 hi-shadow-md hi-shadow-gray-400 dark:hi-shadow-gray-100/50 hi-p-4 hi-z-[1000] hi-rounded-lg hi-w-[90%] hi-max-w-[300px]",
      style: { display: "none" },
    });

    this.backdrop = this.createElement("div", {
      class: "hi-fixed hi-inset-0 hi-bg-black/50 hi-z-[999]",
      style: { display: "none" },
      onclick: () => this.hideMenu(),
    });

    document.body.append(this.backdrop, this.menu);
  }

  createElement(tag, attributes) {
    const element = document.createElement(tag);
    Object.entries(attributes || {}).forEach(([key, value]) => {
      if (key === "style") {
        Object.assign(element.style, value);
      } else if (key === "onclick") {
        element.onclick = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    return element;
  }

  attachEventListeners(elementID) {
    const contextMenuHandler = (event) => {
      event.preventDefault();
      const target = event.target.closest(elementID);
      if (!target) return;

      this.event = event;
      this.target = target;
      this.displayMenu(event);
    };

    this.elements.forEach((element) =>
      element.addEventListener("contextmenu", contextMenuHandler)
    );

    document.addEventListener("click", () => this.hideMenu());
  }

  displayMenu(event) {
    this.menu.style.display = "block";

    const { clientX: left, layerY: top } = event;

    const { offsetWidth: menuWidth, offsetHeight: menuHeight } = this.menu;

    if (window.innerWidth <= 768) {
      this.menu.style.left = "50%";
      this.menu.style.top = "50%";
      this.menu.style.transform = "translate(-50%, -50%)";
      this.backdrop.style.display = "block";
    } else {
      if (left + menuWidth > window.innerWidth) {
        this.menu.style.left = `${window.innerWidth - menuWidth}px`;
      } else {
        this.menu.style.left = `${Math.min(left)}px`;
      }

      var body = document.body,
        html = document.documentElement;

      var height = Math.max(
        // body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        // html.scrollHeight,
        html.offsetHeight
      );

      
      this.menu.style.top = `${Math.min(top,height-(menuHeight+10))}px`;

      this.menu.style.transform = "none";
    }

    if (typeof this.contextmenu_callback === "function") {
      this.contextmenu_callback({ ...event, target: this.target });
    }
  }

  hideMenu() {
    this.menu.style.display = "none";
    this.backdrop.style.display = "none";
  }

  onFocus(callback) {
    this.addElementListener("focus", callback);
  }

  onBlur(callback) {
    this.addElementListener("blur", callback);
  }

  addElementListener(eventType, callback) {
    this.elements.forEach((element) =>
      element.addEventListener(eventType, (event) => {
        const target = event.target.closest(element.tagName);
        if (target) callback({ ...event, target });
      })
    );
  }

  title(title, textAlign = "center") {
    let titleDiv = this.menu.querySelector("div[data-title]");
    if (!titleDiv) {
      titleDiv = this.createElement("div", {
        "data-title": "true",
        style: { paddingTop: "4px", paddingBottom: "4px", textAlign },
      });

      titleDiv.innerHTML = title;

      const hr = this.createElement("hr", { style: { opacity: 0.3 } });
      this.menu.prepend(titleDiv,hr);

    } else {
      titleDiv.style.textAlign = textAlign;
      titleDiv.innerHTML = title;
    }
  }

  makeSvgFromData(svgIcon, add_class) {
    const svgDecoded = decodeURIComponent(svgIcon.split(",")[1]);
    const svgElement = new DOMParser().parseFromString(
      svgDecoded,
      "image/svg+xml"
    ).documentElement;
    svgElement.setAttribute("class", add_class);
    return svgElement;
  }

  add(label, action = null) {
    const item = this.createElement("div", {
      class:
        "hi-relative hi-flex hi-items-center hi-justify-between hi-gap-2 hover:hi-bg-gray-200 dark:hover:hi-bg-gray-600 hi-duration-100 hi-px-1 hi-py-3 hi-rounded hi-min-w-32",
    });

    const textContent = this.createElement("div");
    textContent.innerHTML = label?.label || label;
    item.appendChild(textContent);

    if (label?.svgString || label?.svgIcon) {
      const iconContainer = this.createElement("div", {
        class: label?.svgIcon ? "hi-text-black dark:hi-text-white" : undefined,
      });

      const svg = label?.svgString
        ? this.createElement("div", { innerHTML: label.svgString })
        : this.makeSvgFromData(label.svgIcon, "hi-size-5");
      iconContainer.appendChild(svg);
      item.appendChild(iconContainer);
    }

    if (action) {
      item.onclick = (e) => {
        e.stopPropagation();
        this.hideMenu();
        action({ ...this.event, target: this.target });
      };
    }

    this.menu.appendChild(item);
    return [item];
  }
}
