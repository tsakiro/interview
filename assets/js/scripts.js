// Get cookie by name or value
function getCookie(c_name) {
    var c_value = document.cookie,
        c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) c_start = c_value.indexOf(c_name + "=");
    if (c_start == -1) {
        c_value = null;
    } else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}

// Set lang to Norwegian by default
if (!getCookie('lang')) {
    document.cookie = "lang=nb;";
}

// Use cookie value to set the document language and fetch the correct content from the json
function setLang(langCode) {
    document.cookie = "lang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "lang="+langCode+";";
    location.reload();
}

// Declare main app
var app = new Reef('#app', {
	data: {
        modules: [],
        langs: [
            {
                "code": "nb",
                "label": "Norsk"
            },
            {
                "code": "en",
                "label": "English"
            },
            {
                "code": "es",
                "label": "Español"
            }
        ]
	},
	template: function (props) {
    
    // If there are no modules
    if (!props.modules.length) {
      return `<p>No content available.</p>`;
    }

    // Global variables
    var appName = props.modules[0].name;
    var domElem, innerElem;
    var currentLang = document.documentElement.lang = getCookie("lang");
    
    // Build modules
    return `

        <ul class="lang-switcher">
            ${props.langs.map(function (lang) {
                return `
                    <li onclick="setLang('${lang.code}');" data-lang="${lang.code}">
                        <span>${lang.label}</span>
                    </li>`;
            }).join('')}
        </ul>

        ${props.modules.map(function (module) {

            // Assign structure and data to each module
            switch (module.type) {

                case "Hero":
                    domElem = 'header';
                    innerElem = `
                    <a class="site-logo" href="/" rel="home" title="${appName}">
                        <img src="./assets/img/${module.overlay.image.file}" alt="${appName}" title="${appName}" />
                    </a>`;
                    break;

                case "Title":
                    domElem = 'h1';
                    innerElem = module.text[currentLang];
                    break;

                case "ImageAndText":
                    domElem = 'div';
                    innerElem = `
                    <h2>${module.text.title[currentLang]}</h2>
                    <p>${module.text.body[currentLang]}</p>
                    <img src="./assets/img/${module.image.file}" alt="${module.image.alt[currentLang]}" title="${module.image.alt[currentLang]}" class="${module.image.position}" />
                    `;
                    break;

                case "Info":
                    domElem = 'div';
                    innerElem = `
                    <img src="./assets/img/${module.image.file}" alt="${module.image.alt[currentLang]}" title="${module.image.alt[currentLang]}" />
                    <h2>${module.text.title[currentLang]}</h2>
                    <p>${module.text.body[currentLang]}</p>
                    `;
                    break;

                case "Footer":
                    domElem = 'footer';
                    innerElem = `
                    <address>
                        <strong>${module.left.title[currentLang]}</strong>
                        <span>${module.left.body}</span>
                        <span>${module.left.building[currentLang]}</span>
                        ${module.left.address}
                    </address>
                    <img src="./assets/img/${module.center.image.file}" alt="${appName}" title="${appName}" />
                    <section>
                        <strong>${module.right.title[currentLang]}</strong>
                        <a href="mailto:${module.right.email}">${module.right.emailText}</a>
                        <a href="tel:${module.right.phone}">${module.right.phone}</a>
                    </section>
                    `;
                    break;

                default:
                    domElem = 'div';
                    innerElem = '';
                    break;
            }

            // Render all modules into app
            return `
                <${domElem} class="${module.type}">
                    ${innerElem}
                </${domElem}>
            `;
        }).join('')}
    `;
    }
});

// Fetch content data
fetch('./assets/js/content.json').then(function (response) {
	return response.json();
}).then(function (data) {
    app.data.modules = data.modules;
});