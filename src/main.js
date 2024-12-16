import "./style.css";
import svg_chevron_right from "./chevron_right.svg";

export default class ContextMenu {
  longpress_event = false;

  constructor(elementID, contextmenu_callback=null) {
    this.menu = document.createElement("div");
    this.menu.id = "custom-menu";
    this.menu.setAttribute(
      "class",
      "hi-select-none hi-bg-white dark:hi-bg-slate-800 dark:hi-text-white hi-absolute hi-flex hi-flex-col hi-gap-2 hi-shadow-md hi-shadow-gray-400 dark:hi-shadow-gray-100/50 hi-p-2 hi-z-[1000] hi-rounded-lg"
    );
    this.menu.style.maxWidth = "300px";

    this.menu.style.display = "none";

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

      
      this.menu.style.left = `${event.pageX}px`;
      this.menu.style.top = `${event.pageY}px`;
      this.menu.style.display = "block";
      
      if(typeof contextmenu_callback ==='function'){
        contextmenu_callback(event)
      }
    };

    this.setToElement((element) =>
      element.addEventListener("contextmenu", event)
    );

    if (this.longpress_event) {
      
      let pressTimer;

      // Duration for long press (in milliseconds)
      const longPressDuration = 500;

      // Function to execute on long press
      const onLongPress = () => {
        event();
      };

      // Touchstart event
      button.addEventListener("touchstart", (e) => {
        e.preventDefault();
        pressTimer = setTimeout(onLongPress, longPressDuration);
      });

      // Touchend event
      button.addEventListener("touchend", (e) => {
        e.preventDefault();
        clearTimeout(pressTimer);
      });

      // Cancel the timer if the user moves their finger
      button.addEventListener("touchmove", (e) => {
        e.preventDefault();
        clearTimeout(pressTimer);
      });

      // Optional: Add mouse support for desktop
      button.addEventListener("mousedown", (e) => {
        e.preventDefault();
        pressTimer = setTimeout(onLongPress, longPressDuration);
      });

      button.addEventListener("mouseup", (e) => {
        e.preventDefault();
        clearTimeout(pressTimer);
      });

      button.addEventListener("mouseleave", (e) => {
        e.preventDefault();
        clearTimeout(pressTimer);
      });
    }

    document.addEventListener("click", () => {
      this.menu.style.display = "none";
    });
  }

  setLongpressEvent() {
    this.longpress_event = true;
  }

  setToElement(event) {
    this.elements.forEach(event);
  }


  onFocus(callback){
    this.setToElement(element=>{
      element.addEventListener('focus', event=>callback(event))
    })
  }

  onBlur(callback){
    this.setToElement(element=>{
      element.addEventListener('blur', event=>callback(event))
    })
  }

  title(title, textAlign = "center") {
    const find = this.menu.querySelector("div[data-title]");
    console.log(find);

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
        this.menu.style.display = "none";
        action(this.event);
      };
    }

    if (submenuItems) {
      console.log();

      item.appendChild(
        this.makeSvgFromData(
          svg_chevron_right,
          "hi-size-4 hi-text-black dark:hi-text-white"
        )
      );

      const submenu = document.createElement("div");
      submenu.style.position = "absolute";
      submenu.style.top = "0";
      submenu.style.left = "100%";
      submenu.style.display = "none";
      submenu.setAttribute(
        "class",
        "hi-bg-white dark:hi-bg-slate-800 dark:hi-text-white hi-absolute hi-flex hi-flex-col hi-gap-2 hi-shadow-md hi-shadow-gray-400 hi-p-2 hi-z-[1000] hi-rounded-lg"
      );

      submenuItems.forEach(
        ({ label: subLabel, action: subAction, submenu: subSubmenu }) => {
          this.add(subLabel, subAction, subSubmenu).forEach((subItem) => {
            submenu.appendChild(subItem);
          });
        }
      );

      item.onmouseenter = () => {
        submenu.style.display = "block";
      };
      item.onmouseleave = () => {
        submenu.style.display = "none";
      };

      item.appendChild(submenu);
    } else {
      item.classList.add("hi-cursor-pointer");
    }

    this.menu.appendChild(item);

    return [item];
  }
}
