(function () {
  const observer = new ResizeObserver((entries) => {
    resizeCaptcha();
  });
  if (document.querySelector(".captcha")) {
    observer.observe(document.querySelector(".captcha"));
  }

  function resizeCaptcha() {
    if (document.querySelector(".captcha")) {
      let y = 0;
      let x = document.getElementById("user").offsetWidth;
      if (document.querySelector(".h-captcha > iframe")) {
        y = document.querySelector(".h-captcha > iframe").offsetWidth;
      } else if (document.querySelector(".g-recaptcha > div")) {
        y = document.querySelector(".g-recaptcha > div").offsetWidth;
      }
      let scale = x / y;
      document.querySelector(".captcha").style.transform = `scale(${scale}, 1)`;
      document.querySelector(".captcha").style.transformOrigin = `left`;
    }
  }

  window.addEventListener("resize", () => {
    resizeCaptcha();
  });

  window.addEventListener("load", () => {
    resizeCaptcha();
  });

  //Copy the Email ID Function
  document.querySelectorAll(".btn_copy").forEach((el) => {
    el.addEventListener("click", () => {
      copyEmailAddress(el);
    });
  });

  function copyEmailAddress(element) {
    let email = document.getElementById("email_id");
    if (email) {
      let el = document.createElement("input");
      el.type = "text";
      el.value = email.innerText;
      document.body.appendChild(el);
      var isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);
      if (isiOSDevice) {
        var editable = el.contentEditable;
        var readOnly = el.readOnly;
        el.contentEditable = true;
        el.readOnly = false;
        var range = document.createRange();
        range.selectNodeContents(el);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        el.setSelectionRange(0, 999999);
        el.contentEditable = editable;
        el.readOnly = readOnly;
      } else {
        el.select();
      }
      document.execCommand("copy");
      el.remove();
      const event = new CustomEvent("showAlert", {
        bubbles: true,
        detail: {
          type: "success",
          message: document.querySelector(".language-helper .copy_text").innerText,
        },
      });
      element.dispatchEvent(event);
    }
  }

  //Supporting Code for "Copy of Email ID" to remove the selection
  document.getElementById("email_id") &&
    document.getElementById("email_id").addEventListener("click", () => {
      document.getElementById("email_id").disabled = true;
    });

  //Scrolling to Div
  document.querySelector(".messages") &&
    document.querySelector(".messages").addEventListener("click", () => {
      setTimeout(() => {
        scroll({
          top: document.querySelector(".message-content").offsetTop,
          behavior: "smooth",
        });
      }, 100);
    });

  //Cookie Policy
  document.getElementById("cookie") &&
    document.addEventListener("DOMContentLoaded", () => {
      if (!localStorage.getItem("cookie")) {
        document.getElementById("cookie").classList.remove("hidden");
        document.getElementById("cookie").classList.add("flex");
      }
    });

  //Cookie Policy Close
  document.getElementById("cookie_close") &&
    document.getElementById("cookie_close").addEventListener("click", () => {
      localStorage.setItem("cookie", "closed");
      document.getElementById("cookie").classList.add("hidden");
      document.getElementById("cookie").classList.remove("flex");
    });

  //Locale Update
  document.getElementById("locale") &&
    document.getElementById("locale").addEventListener("change", (e) => {
      const form = document.getElementById("locale-form");
      form.action = form.action + `/${e.target.value}`;
      form.submit();
    });

  //Locale Update
  document.getElementById("locale-mobile") &&
    document.getElementById("locale-mobile").addEventListener("change", (e) => {
      const form = document.getElementById("locale-form-mobile");
      form.action = form.action + `/${e.target.value}`;
      form.submit();
    });

  //Download Email
  document.addEventListener("loadDownload", () => {
    document.querySelectorAll(".download").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        if (document.querySelector(`#email-${e.target.dataset.id}`) === null) {
          const a = document.createElement("a");
          a.id = `email-${e.target.dataset.id}`;
          a.download = `email-${e.target.dataset.id}.eml`;
          a.href = makeTextFile(e.target.dataset.id);
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            a.remove();
          }, 2000);
        }
      });
    });
  });

  function makeTextFile(id) {
    var textFile = null;
    text = document.querySelector(`#message-${id} textarea`).value;
    var data = new Blob([text], { type: "text/plain" });
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile;
  }

  /** Shortcode Handler for [blogs] */
  if (typeof Shortcode !== "undefined") {
    new Shortcode(document.querySelector(".page"), {
      blogs: function () {
        var data = '<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">';
        var fetchUrl = this.options.url + "/wp-json/wp/v2/posts?_embed";
        var filters = {
          context: this.options.context,
          page: this.options.page,
          per_page: this.options.per_page ? this.options.per_page : 6,
          search: this.options.search,
          after: this.options.after,
          author: this.options.author,
          author_exclude: this.options.author_exclude,
          before: this.options.before,
          exclude: this.options.exclude,
          include: this.options.include,
          offset: this.options.offset,
          order: this.options.order,
          orderby: this.options.orderby,
          slug: this.options.slug,
          status: this.options.status,
          categories: this.options.categories,
          categories_exclude: this.options.categories_exclude,
          tags: this.options.tags,
          tags_exclude: this.options.tags_exclude,
          sticky: this.options.sticky,
        };
        Object.keys(filters).forEach(function (key) {
          if (filters[key]) {
            fetchUrl += "&" + key + "=" + filters[key];
          }
        });
        fetch(fetchUrl)
          .then((response) => response.json())
          .then((blogs) => {
            blogs.forEach(function (item) {
              data += `
              <a class="bg-gray-50 rounded-lg shadow-sm" href="${item.link}" target="_blank">
                <article class="relative">
                  <img class="rounded-t-lg h-60 w-full object-cover" src="${item._embedded["wp:featuredmedia"] ? item._embedded["wp:featuredmedia"][0].media_details.sizes.medium.source_url : ""}" alt="featured_image">
                  <span class="absolute top-5 left-5 bg-black text-white px-3 py-1 rounded-full text-sm">${item._embedded["wp:term"][0][0].name}</span>
                  <div class="p-4 xl:p-6 2xl:p-8 space-y-2">
                      <h4 class="font-semibold text-lg">${item.title.rendered.replace(/(<([^>]+)>)/gi, "")}</h4>
                      <p class="text-sm text-gray-600">${item.excerpt.rendered.replace(/(<([^>]+)>)/gi, "")}</p>
                  </div>
                </article>
              </a>
              `;
            });
            data += "</section>";
            if (blogs.length) {
              document.getElementById("blogs").innerHTML = data;
            } else {
              document.getElementById("blogs").innerHTML = '<div class="text-center">204 - NO CONTENT AVAILABLE</div>';
            }
          });
        return `<div id='blogs'><div class="grid grid-cols-6 gap-6"><div class="col-span-6 bg-gray-100 rounded-lg px-5 py-4 text-center"><i class="fas fa-sync-alt fa-spin"></i></div></div></div>`;
      },
      html: function () {
        let txt = document.createElement("textarea");
        txt.innerHTML = this.contents;
        return txt.value;
      },
      contact_form: function () {
        let captcha_html = "";
        let button_attributes = "type='submit'";
        if (captcha_name && captcha_name !== "off") {
          if (captcha_name == "recaptcha2" || captcha_name == "hcaptcha") {
            captcha_html = `<div class="g-recaptcha" data-sitekey="${site_key}"></div>`;
          } else if (captcha_name == "recaptcha3") {
            button_attributes = `class="g-recaptcha" data-sitekey="${site_key}" data-callback='submitContactForm' data-action='submit'`;
          }
        }
        let html = `
        <form class="contact-form pt-5 flex flex-col gap-3" action="/widget/contact" method="post">
          <input type="hidden" name="_token" value="${document.querySelector('meta[name="csrf-token"]').content}" />
          <div class="flex flex-col md:flex-row items-center gap-3">
            <div class="w-full">
              <label class="block mb-1" for="your_name">${__("Your Name")}</label>
              <input class="form-input rounded-md block w-full border" type="text" name="your_name" id="your_name" placeholder="${__("Enter your Name")}" required>
            </div>
            <div class="w-full">
              <label class="block mb-1" for="your_email">${__("Your Email")}</label>
              <input class="form-input rounded-md block w-full border" type="email" name="your_email" id="your_email" placeholder="${__("Enter your Email")}" required>
            </div>
          </div>
          <div>
            <label class="block mb-1" for="your_message">${__("Message")}</label>
            <textarea class="form-input rounded-md block w-full border" name="your_message" id="your_message" placeholder="${__("Enter your Message")}" required></textarea>
          </div>
          ${captcha_html}
          <button class="form-input rounded-md block w-full border-0 bg-primary text-white" ${button_attributes}>${__("Send Message")}</button>
        </form>
        `;
        return html;
      },
    });
  }
})();

const submitContactForm = () => {
  document.querySelector(".contact-form").submit();
};
