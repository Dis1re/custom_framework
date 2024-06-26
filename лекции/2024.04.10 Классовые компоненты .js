// Классовые компоненты react
// важно соблюдать парадигму фреймворка, в котором работаешь
// При работе с react нужно стараться не использовать getElementById и похожие, а в сторогости нужно работать вообще без них
// В реакте есть понятие ссылки на элемент (это не обязательно может быть html элемент), 
// в компоненте можно создать ссылку на элемент находящийся в её разметке, и обращаться к этому элементу через ссылку.

// note: нужно сделать, чтобы вкладка с активным элементов подсвечивалась

// note: classnames - внешний npm пакет, для работы с классами, который Алексей Сергеевич рекомендует установить.

// пример создания ссылки
class Sth{
    constructor(){
        this.aRef = React.createRef();
    }
}

// привязка ссылки к элепменту
<textarea ref={this.aRef}></textarea>

// пример использования ссылки
this.aRef.current.value = 1;

// Статика в react пишется в папку projectName/src/assets

//note: в 3Д графике можно переписать все поверхности в классы, отнаследованные от главного класса Surfaces
// набор событий, которые мы можем обработать: 
// componentDidMount() - событие аналогичное onload, вызывается, когда элемент отрендерен и положен в разметку.
// componentWillUnmount() - аналог события unonload, в нем мы останавливаем renderLoop и уничтожаем this.graph .

componentDidMount(){
    this.graph = new Graph(/*...*/);
    this.interval = setInterval(/*...*/);
    renderLoop(/*...*/);
}

componentWillUnMount(){
    this.graph = null;
    window.cancelAnimationFrame(this.renderLoop);
    clearInterval(this.interval);
}

// note:  в конструкторе трехнмерно графики мы создаем:
// -WIN объект,
// -canMove,
// -zoomStep,
// -флаги для отрисовки
// и тд

// сложность двухмерной графики в динамической генерации компоненты

// React умеет динамически генерировать компоненты,
this.funcs=[]
render(){
    return (
        <>
        {this.funcs.map((func, index) => <Func key={index} />)}
        </>);
    }
// в компоненту передается массив funcs, у компоненты ui есть State в котором длина массива с функциям и по этом функциям
// ui должен генерировать разметку

// сделать отдельный класс math2D, который считает производную в точке, считает интеграл на интервале, касательную в точке, нули функции и тд

// правила создания компонент, компонента должна быть тупой, то есть не должна содержать бизнес логику, не содержит вычисления, не меняет бизнес логику.
// Адаптивная верстка - верстка, которая корректно отображается на мобильном устройстве, сложность в том, что есть две ориентации
// приложения на react можно отобразить на телефоне online.