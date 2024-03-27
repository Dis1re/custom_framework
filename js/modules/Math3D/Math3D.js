class Math3D {
    constructor(WIN) {
        this.WIN = WIN;
    }

    xs(point) {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const x0 = this.WIN.CAMERA.x;
        return (point.x - x0) / (point.z - z0) * (zs - z0) + x0;
    }

    //дописать ys по примеру xs
    // p.s. это мой вариант, он может быть неверным, но работать
    ys(point) {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const y0 = this.WIN.CAMERA.y;
        return (point.y - y0) / (point.z - z0) * (zs - z0) + y0;
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
    */

    multMatrix(a, b) {
        const c = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        let S = 0;
        const len = 4;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                for (let k = 0; k < len; k++) {
                    S += a[i][k] * b[j][k];
                }
                c[i][j] = S;
                S = 0;
            }
        }
        return c;
    }

    // T - матрица преобразования
    // m - вектор точки(столбец)
    multPoint(T, m) {
        const a = [0, 0, 0, 0]; //вектор результата преобразования
        for (let i = 0; i < T.length; i++) {
            let b = 0;
            for (let j = 0; j < m.length; j++) {
                b += T[j][i] * m[j];
            }
            a[i] = b;
        }
        return a;
    }

    //метод, который заменяет прошлые четыре преобразования
    // он принимает на вход любую матрицу и точку, преобразует её по принимаемой матрице
    transform(matrix, point) {
        //                            VVVVVVVVV - переназванный метод multMatrix
        const result = this.multPoint(matrix, [point.x, point.y, point.z, 1]);
        point.x = result[0];
        point.y = result[1];
        point.z = result[2];
    }

    //пишем новый метод, который может перемножать несколько матриц преобразования
    getTransform(...args) {
        return args.reduce((S, t) =>
                this.multMatrix(S, t) // <- новый метод, который должен перемножать две матрицы
            , [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]]
        );
    }

    //     матрица масштабирования:
    //     (
    //     dx 0 0 0
    //     0 dy 0 0
    //     0 0 dz 0
    //     0 0 0  1
    //     )
    //метод для масштабирования точки
    zoom(delta) {
        // сама матрица масштабирования
        return [
            [delta, 0, 0, 0],
            [0, delta, 0, 0],
            [0, 0, delta, 0],
            [0, 0, 0, 1]
        ];
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
    move(dx = 0, dy = 0, dz = 0) {
        //надо как-то вынести сами матрицы преобразования, чтобы они не вычислялись каждый раз при вызове
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [dx, dy, dz, 1]
        ]
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
    rotateOx(alpha) {
        return [
            [1, 0, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha), 0],
            [0, -Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
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
    rotateOy(alpha) {
        return [
            [Math.cos(alpha), 0, -Math.sin(alpha), 0],
            [0, 1, 0, 0],
            [Math.sin(alpha), 0, Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
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
    rotateOz(alpha) {
        return [
            [Math.cos(alpha), Math.sin(alpha), 0, 0],
            [-Math.sin(alpha), Math.cos(alpha), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    //метод, который по всем все полигонам поверхности считает расстояние от его центра,
    // до конечной точки и записывает его в атрибут класса по названию name
    calcDistance(surface, endPoint, name) {
        surface.polygons.forEach(polygon => {

            let x = 0, y = 0, z = 0;
            polygon.points.forEach(index => {
                x += surface.points[index].x;
                y += surface.points[index].y;
                z += surface.points[index].z;
            });
            x /= polygon.points.length;
            y /= polygon.points.length;
            z /= polygon.points.length;

            polygon[name] = Math.sqrt(
                (endPoint.x - x) ** 2 +
                (endPoint.y - y) ** 2 +
                (endPoint.z - z) ** 2
            );//квадратный корень - это очень тяжёлая операция, как синус, косинус и подобные.
        });
    }

    // алгоритм, который сортирует полигоны по уменьшению их дистанции до камеры
    sortByArtistAlgorithm(polygons) {
        polygons.sort((a, b) => (a.distance < b.distance) ? 1 : -1);
    }

    //добавим метод в Math3D для высчета освещения
    calcIllumination(distance, lumen) {
        const illum = distance ? lumen / distance ** 2 : 1;
        return illum > 1 ? 1 : illum;
    }

    getVector(a, b) {
        return {
            x: b.x - a.x,
            y: b.y - a.y,
            z: b.z - a.z
        }
        // возвращаем не точку, потому что операция new тяжёлая, а этот методы мы будем использовать при рендере
    }

    multVector(a, b) {
        return {
            x: a.y * b.z - a.z * b.y,
            y: -a.x * b.z + a.z * b.x,
            z: a.x * b.y - a.y * b.x
        }
    }

    moduleVector(a) {
        return Math.sqrt( a.x**2 + a.y**2 + a.z**2 );
    }

    // считает центр каждого полигона в поверхности и записывает в его свойства
    calcCenter(surface) {
        surface.polygons.forEach(polygon => {
            let x = 0, y = 0, z = 0;
            polygon.points.forEach(index => {
                x += surface.points[index].x;
                y += surface.points[index].y;
                z += surface.points[index].z;
            });
            x /= polygon.points.length;
            y /= polygon.points.length;
            z /= polygon.points.length;
            polygon.center = new Point(x, y, z);
        });
    }

    calcRadius(surface) {
        const points = surface.points;
        surface.polygons.forEach(polygon => {
            const center = polygon.center;
            const p1 = points[polygon.points[0]];
            const p2 = points[polygon.points[1]];
            const p3 = points[polygon.points[2]];
            const p4 = points[polygon.points[3]];
            polygon.R = (this.moduleVector(this.getVector(center, p1))
                    + this.moduleVector(this.getVector(center, p2))
                    + this.moduleVector(this.getVector(center, p3))
                    + this.moduleVector(this.getVector(center, p4)))
                /4;
        });
    }

    calcShadow(polygon, scene, LIGHT) {
        const result = {isShadow: false};
        const m1 = polygon.center;
        const r = polygon.R;
        const S = this.getVector(m1, LIGHT);
        scene.forEach( (surface, index) => {
            if (polygon.index === index) return;
            surface.polygons.forEach( polygon2 => {
                const m0 = polygon2.center;
                if (m1.x === m0.x && m1.y === m0.y && m1.z === m0.z) return;
                if (polygon2.lumen >= polygon.lumen) return;
                const dark = this.moduleVector(
                    this.multVector(
                        this.getVector(m0, m1),
                        S
                    )
                ) / this.moduleVector(S);

                if (dark < r) {
                    result.isShadow = true;
                    result.dark =  0.7;
                }
            } );
        } );
        return result;
    }

}