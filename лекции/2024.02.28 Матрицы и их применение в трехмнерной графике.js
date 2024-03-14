// 

/*
    Визуальное преобразование возможно двумя способами:
        1) изменение самой сцены.
        2) изменения положения камеры.
    Мы будем использовать 1 вариант, то есть это означает фиксированные координаты камеры и её обзора.+
    Изменение сцены происходит через изменение координат самой сцены.
    Любые преобразования трёхмерной сцены производится через матрицы преобразования.
    Есть общая матрица любого преобразования. Ею почти никто не пользуется, мы будем применять её частные случаи:
    матрицы масштабирования, поворота, переноса.
    Матрицы поворота осей, работают на вращении точек вокруг центра.
    Матрица преобразования имеет размерность 4х4.
    Точка тоже должна быть 4-ёхмерной
    матрица масштабирования:
    (
    dx 0 0 0
    0 dy 0 0
    0 0 dz 0
    0 0 0  1
    )
*/

//
//Math3D.js
class Math3D{
    //...
    // T - матрица преобразования
    // m - вектор точки(столбец)
    multMatrix(T, m) {
        const a = [0, 0, 0, 0]; //вектор результата преобразования
        for (let i = 0; i < T.length; i++){
            let b = 0;
            for (let j = 0; j < m.length; j++){
                b += T[j][i] * m[j];
            }
            a[i] = b;
        }
        return a;
    }

    //метод для масштабирования точки
    zoom(point, delta){
        // сама матрица масштабирования
        const T = [
            [delta, 0, 0, 0],
            [0, delta, 0, 0],
            [0, 0, delta, 0],
            [0, 0, 0, 1]
        ];
        const array = this.multMatrix(T, [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    //метод для параллельного переноса
    /*
    сама матрица
    (
    1 0 0 0
    0 1 0 0
    0 0 1 0
    dx dy dz 1
    (
    */
    move(point, dx=0, dy=0,dz=0){
        //надо как-то вынести сами матрицы преобразования, чтобы они не вычислялись каждый раз при вызове
        const T = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [dx, dy, dz, 1]
        ];
        const array = this.multMatrix(T, [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    /*матрица поворота относительно ox
    матрциа:
    (
    1 0 0 0
    0 cos(a) sin(a) 0
    0 -sin(a) cos(a) 0
    0 0 0 1
    )
    * */
    rotateOx(point, alpha){
        const T = [
            [1, 0, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha), 0],
            [0, -Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
        const array = this.multMatrix(T, [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    rotateOy(point, alpha){
        const T = [
            [Math.cos(alpha), 0, -Math.sin(alpha), 0],
            [0, 1, 0, 0],
            [Math.sin(alpha), 0, Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
        const array = this.multMatrix(T, [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    rotateOz(point, alpha) {
        const T = [
            [Math.cos(alpha), Math.sin(alpha), 0, 0],
            [-Math.sin(alpha), Math.cos(alpha), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        const array = this.multMatrix(T, [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    //...
}

/*
* надо добавить нескольлко callback'ов в graph3d
* те же самые, которые были в graph2d(wheel, mousemove и тж.)
*/
//Graph3D.js
class Graph3D extends Component {
    constructor(props) {
        //...
        this.graph = new Graph(
            //...
            callbacks:{
                wheel: (event) => this.wheel(event),
                mousemove: (event) => this.mousemove(event),
                mouseup: () => this.mouseup(),
                mousedown: () => this.mousedown()
            }
        );
        //...
        this.canMove = false;
    }

    mouseup() {
        this.canMove = false;
    }

    mousedown() {
        this.canMove = true;
    }

    wheel(event) {
        event.preventDefault(); //устанавливает обработку по умолчанию
        const delta = (event.wheelDelta > 0)? 0.9: 1.1;
        this.scene.points.forEach( point => this.math3D.zoom(point, delta));
        this.renderScene();
    }

    mousemove(event) {
        if (this.canMove) {
            const gradus = Math.PI / 180/ 4;
            this.scene.points.forEach( point => {
                this.math3D.rotateOx(point, (this.dy-event.offsetY)*gradus );
                this.math3D.rotateOy(point, (this.dx-event.offsetX)*gradus );
            });
            this.renderScene();
        }
        this.dy = event.offsetY;
        this.dx = event.offsetX;
    }

    //...
}

/*
* реализвовать написанный код
* нарисовать сферу и тор к кубу
* по нажатой правой кнопки мыши крутить сцену только по оси х
* по зажатии средней кнопки мыши крутить сцену по осям оу и ох
* сделать все основные поверхности второго порядка
* */