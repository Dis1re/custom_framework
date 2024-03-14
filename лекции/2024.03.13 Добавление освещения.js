// Добавление освещения


// правильный алгоритм для отрисовки полигонов
// задача отображения нескольких фигур на сцене
/*
отрисовка фигур происходит последовательно без учёте положения относительно друг друга.
способ решения: все полигоны всех фигур добавляются в один массив, который сортируется по ростоянию до камеры
и полигоны мы рисуем сообразно этому массиву.
Освещение и тени - это две разные задачи в трехмерной.
Задача освещённости в зависимости от расстояния до источника света и в зависимости от освещённости либо в цвет полигона,
либо в затемнённый цвет.
в js есть функция rgb(r, g, b), в которую можно задавать цвет в десятичной системе.
Это ставит ограничение на способ задавания цвета полигона, а именно его надо задавать всегда в шестнад. системе.
*/

//добавим новую сущность light
//entities/Light.js
class Light extends Point {
    constructor(x, y, z, lumen = 10000) {
        super(x, y, z);
        this.lumen = lumen;
    }
}

//дополним класс Polygon пару методами.
class Polygon {
    //...
    constructor(points = [], color = '#555555') {
        this.points = points;
        this.color = this.hexToRgb(color);
        this.distance = 0;
        this.lumen = 1;
    }

    hexToRgb(hex) {
        // в result присвоим значение регулярного выражения.
        // регулярные выражения - это написанные по специальным правилам строки,
        // определяющие правила сравнения входящих значений (тяжёлая операция).
        // область применения: сравнение вводимых пользователем на соответствие маске ввода.
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 255, g: 0, b: 0};
    }

    rgbToHex(r, g, b) {
        return `rgb(${r}, ${g}, ${b})`;
    };
}

//добавим метод в Math3D для высчета освщения
//Math3D.js
class Math3D {
    //...
    calcIllumination(distance, lumen) {
        const illum = distance ? lumen / distance ** 2 : 1;
        return illum > 1 ? 1 : illum;
    }
}

//
//Graph3D.js
class Graph3D extends Comment {
    constructor(props) {
        super(props);
        //...
        this.LIGHT = new Light(-40, 15, 0, 15000);
    }

    //...
    renderScene() {
        //...
        this.math3D.calcDistance(this.scene, this.WIN.CAMERA, 'distance');
        this.math3D.calcDistance(this.scene, this.LIGHT, 'lumen');
        this.math3D.sortByArtistAlgorithm(this.scene);
        this.scene.polygons.forEach(polygon => {
            const points = /*...*/;
            const lumen = this.math3D.calcIllumination(polygon.lumen, this.LIGHT.lumen);
            let {r, g, b} = polygon.color;
            r = Math.round(r * lumen);
            g = Math.round(g * lumen);
            b = Math.round(b * lumen);
            this.graph.polygon(points, polygon.rgbToHex(r, g, b));
        });
    }
}

/*
дезешечка:
-реализовать код с лекции
-добавить флаг, для включения или отключения изменения координат источника цвета с изменением сцены
-*добавить несколько источников света
-**сделать цветной источник света

Note: на зачёт нужны будут фигуры второго порядка:
    - гиперболический цилиндр
    - параболический цилиндр
    - эллиптический цилиндр
    - однополостный гиперболоид
    - двухполостный гиперболоид
    - эллипсоид
    - конус
    - сфера
    - эллиптический парабалоид
    - гиперболический параболоид
    - тор
    - бутылка клейна
*/