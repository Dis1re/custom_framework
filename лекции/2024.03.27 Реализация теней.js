//добавление теней

/*
трассировка теней - это вычислительно сложная задача, то есть
для реализации нужно сделать много вычислений.
Вычислительная сложность заключается в том, что:
1) Все полигоны нужно сравнить со всеми полигонами
2) Каждую точку каждого полигона нужно сравнить со всеми точками сцены
3) источников может быть несколько.

способы упрощения трассировки теней:
1) заранее каджый полигон мы будем затенять целиком
2) источник света будет исключительно точечным
3) источник света будет один

подзадача: нужно высчитывать, как один полигон перекрывает другой.\
Решение: у каждого полигона есть центр, и мы будем высчитвать тень по радиусу от его центра,
мы будем считать векторное произведение от вектора между источником света и перекрытым полигоном и вектором между перекрывающим и перекрытым.
*/

//допишем класс полигон
// js/modules/Math3D/entites/Polygon.js
class Polygon {
    constructor(/*...*/) {
        // ...
        this.center = new Point(); //добавим центр в класс полигона
        this.R = 1; // и добавим радиус полигона
    }
}

//допишем несколько методов для работы с векторами
// js/modules/Math3D/Math3D.js
class Math3D {



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
        //перенести код для расчёта центра полигона из метода calcIllumination из Math3D
    }

    calcRadius(surface) {
        const points = surface.points;
        surface.polygon.forEach(polygon => {
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
                if (polygon2.lumen < polygon.lumen) return; // проверка на то, что менее освещённый полигон не может отбросить тень на более освещённый полигон
                                                            //   note: спорная проверка, надо её перепроверить
                const dark = this.moduleVector( 
                    this.multVector(
                        this.getVector(m0, m1),
                        S
                    )
                 ) / this.moduleVector(S);

                if (dark < r) {
                    result.isShadow = true;
                    result.dark = dark /1.3;
                }
            } );
        } );
        return result;
    }

}

// тени считаются исключительно по чекбоксу и изначально он должен быть выключен, так как


// 
class Graph3D {
    //...

    renderScene(/*...*/) {

        const polygons = [];
        this.scene.forEach((surface, index) => {
            this.math3D.calcCenter(surface);
            this.math3D.calcRadius(surface);
            this.math3D.calcDistance(surface, this.WIN.CAMERA, 'distance');
            this.math3D.calcDistance(surface, this.LIGHT, 'lumen');
            surface.polygons.forEach(polygon => {
                polygon.index = index;
                polygons.push(polygon);
            } );
        } );

        this.math3D.sortByArtist(polygons);

        polygons.forEach(polygon => {
            //const points = ...;
            let {r, g, b} = polygon.color;
            const {isShadow, dark}  = this.math3D.calcShadow(polygon, this.scene, this.LIGHT);
            const lumen = this.math3D.calcIllumination(polygon.lumen, this.LIGHT.lumen*(isShadow?dark: 1));
            
            //...
            
        });

    }

}


// дезешечка:
// -реализовать код с лекции
// - не рисовать невидимые полигоны
// -*сделать так, чтобы фигура могла отбрасывала тень на себя же