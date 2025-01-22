import "./style.css";
import svg_chevron_right from "./chevron_right.svg";

export default class ContextMenu {
  longpress_event = false;

  constructor(elementID, contextmenu_callback = null) {
    this.menu = document.createElement("div");
    this.menu.id = "custom-menu";
    this.menu.setAttribute(
      "class",
      "hi-select-none hi-bg-white dark:hi-bg-slate-800 dark:hi-text-white hi-absolute hi-flex hi-flex-col hi-gap-2 hi-shadow-md hi-shadow-gray-400 dark:hi-shadow-gray-100/50 hi-p-4 hi-z-[1000] hi-rounded-lg hi-w-[90%] hi-max-w-[300px]"
    );
    this.menu.style.display = "none";

    // Add a semi-transparent backdrop for modal effect
    this.backdrop = document.createElement("div");
    this.backdrop.setAttribute(
      "class",
      "hi-fixed hi-inset-0 hi-bg-black/50 hi-z-[999]"
    );
    this.backdrop.style.display = "none";
    this.backdrop.onclick = () => this.hideMenu();

    document.body.appendChild(this.backdrop);
    document.body.appendChild(this.menu);

    this.elements = [document];

    if (elementID) {
      this.elements = document.querySelectorAll(elementID);
    }

    const event = (event) => {
      event.preventDefault();
      const target = event.target;
      this.event = event;
      this.target = target;

      if (window.innerWidth <= 768) {
        // Center the menu for mobile devices
        this.menu.style.left = "50%";
        this.menu.style.top = "50%";
        this.menu.style.transform = "translate(-50%, -50%)";
        this.backdrop.style.display = "block";
      } else {
        // Show the menu at the cursor's position for larger screens
        this.menu.style.left = `${event.pageX}px`;
        this.menu.style.top = `${event.pageY}px`;
        this.menu.style.transform = "none";
      }

      this.menu.style.display = "block";

      if (typeof contextmenu_callback === "function") {
        contextmenu_callback(event);
      }
    };

    this.setToElement((element) =>
      element.addEventListener("contextmenu", event)
    );

    document.addEventListener("click", () => {
      this.hideMenu();
    });
  }

  hideMenu() {
    this.menu.style.display = "none";
    this.backdrop.style.display = "none";
  }

  setLongpressEvent() {
    this.longpress_event = true;
  }

  setToElement(event) {
    this.elements.forEach(event);
  }

  onFocus(callback) {
    this.setToElement((element) => {
      element.addEventListener("focus", (event) => callback(event));
    });
  }

  onBlur(callback) {
    this.setToElement((element) => {
      element.addEventListener("blur", (event) => callback(event));
    });
  }

  title(title, textAlign = "center") {
    const find = this.menu.querySelector("div[data-title]");

    if (find == null) {
      const div = document.createElement("div");
      div.setAttribute("data-title", "true");
      div.style.paddingTop = "4px";
      div.style.paddingBottom = "4px";
      div.innerHTML = title;
      div.style.textAlign = textAlign;

      const hr = document.createElement("hr");
      hr.style.opacity = 0.5;

      this.menu.prepend(hr);
      this.menu.prepend(div);
    } else {
      find.style.textAlign = textAlign;
      find.innerHTML = title;
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

  add(label, action = null, submenuItems = null) {
    var svgString = null;
    var svgIcon = null;

    if (typeof label === "object") {
      if (label?.svgString) {
        svgString = label?.svgString;
      } else if (label?.svgIcon) {
        svgIcon = label?.svgIcon;
      }

      label = label.label;
    }

    const item = document.createElement("div");
    item.setAttribute(
      "class",
      "hi-relative hi-flex hi-items-center hi-justify-between hi-gap-2 hover:hi-bg-gray-200 dark:hover:hi-bg-gray-600 hi-duration-100 hi-px-1 hi-py-3 hi-rounded hi-min-w-32"
    );

    const textContent = document.createElement("div");
    textContent.innerHTML = label;
    item.appendChild(textContent);

    if (svgString) {
      const svgDIV = document.createElement("div");
      svgDIV.innerHTML = svgString;
      item.appendChild(svgDIV);
    }

    if (svgIcon) {
      const imgDIV = document.createElement("div");
      imgDIV.setAttribute("class", "hi-text-black dark:hi-text-white");
      imgDIV.appendChild(this.makeSvgFromData(svgIcon, "hi-size-5"));
      item.appendChild(imgDIV);
    }

    if (action) {
      item.onclick = (e) => {
        e.stopPropagation();
        this.hideMenu();
        action(this.event);
      };
    }

    this.menu.appendChild(item);

    return [item];
  }
}
