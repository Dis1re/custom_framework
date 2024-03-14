//Фреймворки их назначение и применение.
/*
Фреймворк – это набор библиотек, функций, структур данных, 
расширений над языком, алгоритмов и соглашений по написанию 
кода, это решение, которое позволяет легко писать код. 
*/
/*
Достоинства фреймворка: 
•	Увеличение скорости написания приложения, засчёт заранее реализованного функционала.
•	Сохранения состояния приложения.
•	Управления данными приложения.
*/
/*
Цели использования фреймворка: 
•	Повышение скорости разработки.
•	Повышение стабильности кода.
•	Стандартизация написания кода.
*/
/*
В большинстве фреймворков весь код приложения разделяется на обособленные,
не связанные между собой модули - компоненты. Особенность фреймворка в том,
что он использует только их. Компоненты могут быть вложены друг в друга.
Даже само приложение является большой компонентой.
*/
/*
Компонента отвечает за:
•	формирование разметки частей страницы.
•	обработку событий на этой части страницы.
•	За сохранности данных.
•	За показ и убирание различных компонент с экрана.
*/

/*
Все компоненты лежат в папке js.
•	Папка со всеми компонентами Сomponents.
•	Приложение будет лежать в App.js. Компонента должна быть «тупой», то есть отвечает только за разметку.
•	Логика будет лежать в файле modules.js.
•	Ядро будет лежать в двух файлах: Template.js и Component.js.
•	Точка старта будет в index.js
*/



//js/Template.js
function Template() {}
//в функцию Template записываются все шаблоны компонентов
//шаблоны страниц записываются в прототип функции template


//js/Component.js
class Component {
    constructor( {id, parent, template, templateParams=null, 
    callbacks={}, className }) {
        this.id = id;
        this.parent = parent;
        this.callbacks = callbacks;
        this.render( template(templateParams), className );
        this.addEventListeners();
    }
    
    show() {
        document.getElementById(this.id).classList.remove('hide');
    }
    
    hide() {
        document.getElementById(this.id).classList.add('hide');
    }
    
    render(template, className) {
        const elem = document.createElement('div');
        elem.setAttribute('id', this.id);
        if (className) {
            elem.classList.add(className);
        }	
        elem.innerHTML = template;
        if (this.parent) {
            document.getElementById(this.parent).appendChild(elem);
        } else {
            document.querySelector('body').appendChild(elem);
        }
    }
    
    addEventListeners () {}
}
//Методы класса show(), hide(), render() переопределять нельзя, а addEventListeners() нужно!
    
//style.css
//...
.hide{display:none;}
//...

//index.js
const template = new Template;
window.onload = function() {
	new App( { id:'app', template: ()=>'' } )
}

//Js/App.js
class App extends Component () {
	constructor( props ){
		super(props);
	this.header = new Header({
        id: 'header',
        parent: this.id,
        template: template.headerTemplate,
        callbacks: {
                showPage: (name) => this.showPage(name)
            }
        });
    }

    showPage(name) {
        if (this[name]?.show) {
            qthis[name].show();
        }
    }
}

//js/Components/haederTemplate.js
Template.prototype.headerTemplate = () => `
<button id=”show2D” >2D</button>
<button id=”showCalc” >Calc</button>
`;

//js/Components/Header.js
class Header extends Component {
	addEventListeners() {
		document.getElementById('show2D').addEventListeners(
            'click', () => this.callbacks.showPage('graph2D')
        );
        document.getElementById('showCalc').addEventLisener(
            'click', () => this.callbacks.showPage('calc')
        );
    }
}

//дезешечка: переписать код и вместить HTML  с других элементов  в этот шаблон. 