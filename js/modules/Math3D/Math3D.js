class Math3D {
    constructor(WIN) {
        this.WIN = WIN;
    }

    xs(point){
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const x0 = this.WIN.CAMERA.x;
        return (point.x - x0)/(point.z - z0) * (zs - z0) + x0;
    }

    //дописать ys по примеру xs
    // p.s. это мой вариант, он может быть неверным, но работать
    ys(point){
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const y0 = this.WIN.CAMERA.y;
        return (point.y - y0)/(point.z - z0) * (zs - z0) + y0;
    }

    /*
    Визуальное преобразование возможно двумя способами:
        1) изменение самой сцены.
        2) изменения положения камеры.
    Мы будем использовать 1 вариант, то есть это означает фиксированные координаты камеры и её обзора.
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

    //метод для параллельного переноса по осям
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

    /*
    матрица поворота относительно ox
    матрциа:
    (
    1 0 0 0
    0 cos(a) sin(a) 0
    0 -sin(a) cos(a) 0
    0 0 0 1
    )
    */
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

    /*
    матрица поворота относительно oy
    матрица:
    (
    cos(a) 0 -sin(a) 0
    0 1 sin(a) 0
    sin(a) 0 cos(a) 0
    0 0 0 1
    )
    */
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

    /*
    матрица поворота относительно oz
    матрица:
    (
    сos(a) sin(a) 0 0
    -sin(a) cos(a) 0 0
    0 0 1 0
    0 0 0 1
    )
    */
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

    calcDistance(surface, endPoint, name) {
        surface.polygons.forEach(polygon => {
            let x=0, y=0, z=0;
            polygon.points.forEach(index => {
                x+= surface.points[index].x;
                y+= surface.points[index].y;
                z+= surface.points[index].z;
            });
            x /= polygon.points.length;
            y /= polygon.points.length;
            z /= polygon.points.length;
            polygon[name] = Math.sqrt(
                (endPoint.x-x)**2 +
                (endPoint.y-y)**2 +
                (endPoint.z-z)**2
            );//квадратный корень - это очень тяжёлая операция, как синус, косинус и подобные.
        });
    }

    sortByArtistAlgorithm(surface) {
        surface.polygons.sort((a, b) => (a.distance < b.distance)? 1: -1);
    }

    //добавим метод в Math3D для высчета освщения
    calcIllumination(distance, lumen){
        const illum = distance? lumen / distance**2 : 1;
        return illum > 1? 1: illum;
    }

}